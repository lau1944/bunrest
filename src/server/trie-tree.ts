import { Handler, RequestTuple, RouteRequestMapper } from "./request";

//import { encodeBase64, decodeBase64 } from "../utils/base64";
export class TrieTree<k extends string, v extends Handler> {
  private readonly root: Node<k, v>;

  constructor() {
    this.root = new Node();
  }

  get(path: string): TrieLeaf<k, v> {
    // const paths = this.validate(path);
    // paths.shift();
    const paths = path.split("/");
    const node: Node<k, v> = this.root;
    const params = {};
    return {
      routeParams: params,
      node: this.dig(node, paths, params),
    };
  }

  insert(path: string, value: v) {
    // const paths = this.validate(path);
    // // remove the first empty string
    // paths.shift();
    const paths = path.split("/");
    let node: Node<string, v> = this.root;
    let index = 0;
    while (index < paths.length) {
      const children = node.getChildren();
      const currentPath = paths[index];
      let target = children.find((e) => e.getPath() === currentPath);
      if (!target) {
        target = new Node<string, v>(currentPath);
        children.push(target);
      }

      node = target;
      ++index;
    }
    // insert handler to node
    node.insertChild(value);
  }

  private dig(
    node: Node<k, v>,
    paths: string[],
    params: { [key: string]: any }
  ): Node<k, v> | null {
    if (paths.length === 0) {
      return node;
    }

    const target = node
      .getChildren()
      .filter((e) => e.getPath() === paths[0] || e.getPath().includes(":"));

    if (target.length === 0) {
      return null;
    }

    let next: Node<k, v> =  null
    for (let i = 0; i < target.length; ++i) {
      const e = target[i];
      if (e.getPath().startsWith(":")) {
        const routeParams = e.getPath().replace(":", "");
        params[routeParams] = paths[0];
      }

      paths.shift();
      next = this.dig(e, paths, params);

      if (next) {
        return next;
      }
    }
    
    return next;
  }

  // private validate(path: string) {
  //   // if (!path.includes("~")) {
  //   //   throw new Error("Path should contains a separator ~");
  //   // }

  //   //const [method, httpPath] = path.split("~");
  //   const paths = path.split("/");
  //   return paths;
  // }
}

export interface TrieLeaf<k, v> {
  node: Node<k, v> | null;
  routeParams: { [key: string]: any };
}

// node of trie tree
class Node<k, v> {
  private readonly path?: string;
  private readonly handlers: Handler[] = [];
  private readonly children: Node<k, v>[] = [];

  constructor(path?: string) {
    this.path = path;
  }

  insertChild(handler: Handler) {
    this.handlers.push(handler);
  }

  getChildren(): Node<k, v>[] {
    return this.children;
  }

  getHandlers(): Handler[] {
    return this.handlers;
  }

  getPath(): string {
    return this.path;
  }
}
