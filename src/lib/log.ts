import { NodeSelect, formatNode } from "./formatNode";
import { Node } from "../Node";

export const log = (node: Node | Node[], options: NodeSelect, depth = 4) => {
  if (Array.isArray(node)) {
    const output = node.map((n) => formatNode(n, options));
    console.dir(output, { depth });
    return;
  }
  console.dir(formatNode(node, options), { depth });
};
