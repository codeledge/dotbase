import { ClientNode, Node } from "./Node";
import { ClientRel, Rel } from "./Rel";

export enum IteratorResult {
  CONTINUE,
  STOP,
}

export class GraphBase<DN = any, DR = any> {
  nodes: Record<Node["id"], Node> = {};
  rels: Record<Rel["id"], Rel> = {};

  addNode<N = DN>(data?: N) {
    // @ts-ignore
    const id = data?.["id"];
    if (id && this.nodes[id]) {
      return this.nodes[id] as Node<N>;
    }
    const node = new Node<N>(data);
    this.nodes[node.id] = node;
    return node;
  }

  hasNode(id: Node["id"]): boolean {
    return !!this.nodes[id];
  }

  linkNodes<F = DN, T = DN, R = DR>(
    from: Node<F>,
    to: Node<T>,
    { data, skipDuplicates }: { data?: R; skipDuplicates?: boolean } = {}
  ) {
    if (skipDuplicates && from.out.find(({ to: toNode }) => toNode === to))
      return;
    const rel = new Rel(from, to, { data });
    this.rels[rel.id] = rel;
    from.out.push({
      to,
      rel,
    });
    to.in.push({
      from,
      rel,
    });
  }

  walk(
    node: Node,
    iterator?: (node: Node, currentPath: Rel["id"][]) => IteratorResult | void
  ) {
    let visited: Set<Node["id"]> = new Set();
    let isWalkingStopped = false;

    const walkRecursive = (currentNode: Node, currentPath: Rel["id"][]) => {
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

      if (visited.has(currentNode.id)) {
        // console.log("visited", currentNode.id);
        return;
      }
      visited.add(currentNode.id);

      currentNode.out.forEach((link) => {
        walkRecursive(link.to, currentPath.concat(link.rel.id));
      });
    };

    walkRecursive(node, []);
  }

  getRels(): ClientRel[] {
    return Object.values(this.rels).map((rel) => this.formatClientRel(rel));
  }

  getPaths(startNode: Node, endNode: Node | ((n: Node) => boolean)) {
    let paths: Rel["id"][][] = [];
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

  formatClientRel(
    rel: Rel,
    { showFrom, showTo }: formatClientRelOptions = {}
  ): ClientRel {
    return {
      id: rel.id,
      data: rel.data,
      ...(showFrom && {
        from: this.formatClientNode(rel.from),
      }),
      ...(showTo && {
        to: this.formatClientNode(rel.to),
      }),
    };
  }

  formatClientNode(
    node: Node,
    {
      showOutLinks,
      showInLinks,
      showOutCount,
      showInCount,
    }: formatClientNodeOptions = {}
  ): ClientNode {
    return {
      id: node.id,
      data: node.data,
      ...(showOutCount && {
        outCount: node.out.length,
      }),
      ...(showInCount && {
        inCount: node.in.length,
      }),
      ...(showOutLinks && {
        out: node.out.map(({ to, rel }) => ({
          to: this.formatClientNode(to),
          rel: this.formatClientRel(rel),
        })),
      }),
      ...(showInLinks && {
        in: node.in.map(({ from, rel }) => ({
          from: this.formatClientNode(from),
          rel: this.formatClientRel(rel),
        })),
      }),
    };
  }

  logNode(id: Node["id"], options?: formatClientNodeOptions): void {
    if (this.nodes[id])
      console.dir(this.formatClientNode(this.nodes[id], options), {
        depth: null,
      });
  }

  getRel<R = DR>(id: Rel<R>["id"], options?: formatClientRelOptions) {
    const rel = this.rels[id];
    if (rel) return this.formatClientRel(rel, options);
  }

  getNodes(): ClientNode[] {
    return Object.values(this.nodes).map(({ id, data }) => ({
      id,
      data,
    }));
  }

  getRoots() {
    return Object.values(this.nodes).filter((node) => {
      return node.out.length === 0;
    });
  }
}

type formatClientNodeOptions = {
  showOutLinks?: boolean;
  showInLinks?: boolean;
  showOutCount?: boolean;
  showInCount?: boolean;
};

type formatClientRelOptions = {
  showFrom?: boolean;
  showTo?: boolean;
};
