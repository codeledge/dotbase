import { Node } from "./Node";
import { Rel } from "./Rel";

export enum IteratorResult {
  CONTINUE,
  STOP,
}

export class GraphBase<DN = any, DR = any> {
  nodes = new Map<Node["id"], Node>();
  rels = new Map<Rel["id"], Rel>();

  addNode<N = DN>(data?: N) {
    // @ts-ignore
    const id = data?.["id"];
    if (id && this.nodes.has(id)) {
      return this.nodes.get(id) as Node<N>;
    }
    const node = new Node<N>(data);
    this.nodes.set(node.id, node);
    return node;
  }

  linkNodes<F = DN, T = DN, R = DR>(
    from: Node<F>,
    to: Node<T>,
    { data }: { data?: R } = {}
  ) {
    const rel = new Rel(from, to, { data });
    this.rels.set(rel.id, rel);
    from.out.push(rel);
    to.in.push(rel);
  }

  hasNode(id: Node["id"]): boolean {
    return this.nodes.has(id);
  }

  getRel<R = DR>(id: Rel<R>["id"]): Rel<R> | undefined {
    return this.rels.get(id);
  }

  getRels(): Rel[] {
    return Array.from(this.rels.values());
  }

  getNode<N = DN>(id: Node["id"]): Node<N> | undefined {
    return this.nodes.get(id);
  }

  getNodes<N = DN>(): Node<N>[] {
    return Array.from<Node<N>>(this.nodes.values());
  }

  getRoots<N = DN>() {
    return this.getNodes<N>().filter((node) => {
      return node.in.length === 0;
    });
  }

  getLeaves<N = DN>() {
    return this.getNodes<N>().filter((node) => {
      return node.out.length === 0;
    });
  }

  getPaths(startNode?: Node, endNode?: Node | ((n: Node) => boolean)) {
    let paths: Rel[][] = [];

    if (!startNode) return paths; // TODO: return all paths

    this.walk(startNode, (currentNode, currentPath) => {
      // console.log("currentNode", currentNode);
      if (endNode instanceof Node && currentNode === endNode) {
        paths.push(currentPath);
        return IteratorResult.CONTINUE;
      } else if (typeof endNode === "function" && endNode(currentNode)) {
        paths.push(currentPath);
        return IteratorResult.CONTINUE;
      }
    });
    return paths;
  }

  walk(
    node: Node,
    iterator?: (node: Node, currentPath: Rel[]) => IteratorResult | void
  ) {
    let isWalkingStopped = false;

    const walkRecursive = (currentNode: Node, currentPath: Rel[]) => {
      // console.log("isWalkingStopped", isWalkingStopped);
      if (isWalkingStopped) return;

      const result = iterator?.(currentNode, currentPath);

      if (result === IteratorResult.STOP) {
        isWalkingStopped = true;
        return;
      }

      if (result === IteratorResult.CONTINUE) {
        return;
      }

      if (
        currentPath.some((rel) => {
          rel.to === currentNode;
        })
      )
        return IteratorResult.CONTINUE;

      currentNode.out.forEach((rel) => {
        walkRecursive(rel.to, currentPath.concat(rel));
      });
    };

    walkRecursive(node, []);
  }
}
