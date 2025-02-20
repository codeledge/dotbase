import { last } from "deverything";
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
  const visitedDots = new Set<Dot["id"]>();
  const visitedRels = new Set<DotRel["id"]>();

  const walkRecursive = (currentNode: Dot, currentPath: DotRel[]) => {
    // console.log("isWalkingStopped", isWalkingStopped);
    if (isWalkingStopped) return;

    // dont do if(visitedDots.has(dot.id))
    // because a dot could be visited but not all its rels

    if (currentPath.length > 0) {
      if (visitedRels.has(last(currentPath).id)) {
        isCyclic = true;
        return;
      }
      if (options?.maxDepth && currentPath.length > options?.maxDepth) return;
    }

    // Now we start visiting from here
    if (currentPath.length > 0) {
      visitedRels.add(last(currentPath).id);
    }
    visitedDots.add(currentNode.id);

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
    if (!visitedDots.has(dot.id)) {
      walkRecursive(dot, []);
    }
  });

  return {
    isCyclic,
    deepestPath,
    isWalkingStopped,
  };
};
