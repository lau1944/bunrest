import { KeyObject } from "crypto";

export class TrieTree<k extends string, v> {
  private readonly root: Node<k, v>;

  constructor() {
    this.root = new Node();
  }

  get(path: string): TrieLeaf<k, v> {
    const { method, paths } = this.validate(path);
    paths.shift();
    let node: Node<k, v> = this.root;
    const params = {}
    return {
      routeParams: params,
      node: this.dig(node, paths, params, method)
    };
  }

  insert(path: string, value: v) {
    const { method, paths } = this.validate(path);
    // remove the first empty string
    paths.shift();
    let node: Node<string, v> = this.root;
    let index = 0;
    while (index < paths.length) {
      const children = node.getChildren();
      const currentPath = `${method}-${paths[index]}`;
      let target = children.find((e) => e.getPath() === currentPath);
      if (!target) {
        target = new Node<string, v>(
          currentPath,
          index === paths.length - 1 ? value : null
        );
        children.push(target);
      }

      node = target;
      ++index;
    }
  }

  private dig(
    node: Node<k, v>,
    paths: string[],
    params: { [key: string]: any },
    method: string
  ): Node<k, v> | null {
    if (paths.length === 0) {
      return node;
    }

    const target = node
      .getChildren()
      .filter(
        (e) =>
          e.getPath() === `${method}-${paths[0]}` || e.getPath().includes(":")
      );

    if (target.length === 0) {
      return null;
    }

    const newPaths = [...paths];
    newPaths.shift();
    let next: Node<k, v> = null;
    target.forEach((e) => {
      if (e.getPath().includes(":")) {
        const routeParams = e.getPath().replace(`${method}-:`, "");
        params[routeParams] = paths[0];
      }

      next = this.dig(e, newPaths, params, method);

      if (next) {
        return next;
      }
    });

    return next;
  }

  private validate(path: string) {
    if (!path.includes("-")) {
      throw new Error("Path should contains a separator -");
    }

    const [method, httpPath] = path.split("-");
    const paths = httpPath.split("/");
    return {
      method,
      paths,
    };
  }
}

export interface TrieLeaf<k, v> {
  node: Node<k, v> | null;
  routeParams: { [key: string]: any };
}

// node of trie tree
class Node<k, v> {
  private readonly path: k;
  private readonly value: v;
  private readonly children: Node<k, v>[] = [];

  constructor(path?: k, value?: v) {
    this.path = path;
    this.value = value;
  }

  insertChild(node: Node<k, v>) {
    this.children.push(node);
  }

  getChildren(): Node<k, v>[] {
    return this.children;
  }

  getPath(): k {
    return this.path;
  }

  getValue(): any {
    return this.value;
  }

  getObject(): Object {
    return {
      path: this.path,
      value: this.value,
    };
  }
}
