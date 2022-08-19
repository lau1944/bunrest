// import { describe, it, expect } from "bun:test";
// import { TrieTree } from "../index";

// describe('data container test', () => {
//     it('trie tree test', () => {
//         const tree: TrieTree<string, number> = new TrieTree();
//         tree.insert('GET-/', 1);
//         expect(tree.get('GET-/')?.node.getValue()).toBe(1);
//         expect(tree.get('GET-/xx')?.node?.getValue()).toBe(undefined);

//         tree.insert('GET-/test1/:id', 2);
//         expect(tree.get('GET-/test1/xxx')?.node.getValue()).toBe(2);

//         tree.insert('POST-/test2', 3);
//         expect(tree.get('POST-/test2')?.node.getValue()).toBe(3);

//         tree.insert('POST-/test1/test1', 4);
//         expect(tree.get('POST-/test1/test1')?.node.getValue()).toBe(4);

//         tree.insert('POST-/test2/test2', 5);
//         expect(tree.get('POST-/test2/test2')?.node.getValue()).toBe(5);
//     });
// })