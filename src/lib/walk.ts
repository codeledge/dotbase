import { Dot } from "../types/Dot";
import { DotRel } from "../types/DotRel";

export enum IteratorResult {
  CONTINUE,
  STOP,
}

export const walk = (
  fromDots: Dot[],
  iterator?: (currentDot: Dot, currentPath: DotRel[]) => IteratorResult | void,
  options?: {
    maxDepth?: number;
    direction?: "out" | "in";
  }
) => {
  let isWalkingStopped = false;
  let isCyclic = false;
  let deepestPath: DotRel[] = [];
  const visited = new Set<Dot["id"]>();

  const walkRecursive = (currentNode: Dot, currentPath: DotRel[]) => {
    // console.log("isWalkingStopped", isWalkingStopped);
    if (isWalkingStopped) return;

    if (options?.maxDepth && currentPath.length > options?.maxDepth) return;

    // Now we start visiting from here
    visited.add(currentNode.id);

    if (currentPath.length > deepestPath.length) {
      deepestPath = currentPath;
    }

    const result = iterator?.(currentNode, currentPath);

    if (result === IteratorResult.STOP) {
      isWalkingStopped = true;
      return;
    }

    if (result === IteratorResult.CONTINUE) {
      return;
    }

    if (
      currentPath.some((rel) =>
        options?.direction === "in"
          ? rel.to === currentNode
          : rel.from === currentNode
      )
    ) {
      isCyclic = true;
      return; // don't use the visited dot, but as an optmization, visited rels could be used
    }

    // BFS
    if (options?.direction === "in") {
      currentNode.in.forEach((rel) => {
        walkRecursive(rel.from, currentPath.concat(rel));
      });
    } else {
      currentNode.out.forEach((rel) => {
        walkRecursive(rel.to, currentPath.concat(rel));
      });
    }
  };

  fromDots.forEach((dot) => {
    if (!visited.has(dot.id)) {
      walkRecursive(dot, []);
    }
  });

  return {
    isCyclic,
    deepestPath,
    isWalkingStopped,
  };
};
