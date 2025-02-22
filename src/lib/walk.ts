import { last } from "deverything";
import { Dot } from "../types/Dot";
import { Rel } from "../types/Rel";

export enum IteratorResult {
  CONTINUE,
  STOP,
}

export const walk = (
  fromDots: Dot[],
  iterator?: (currentDot: Dot, currentPath: Rel[]) => IteratorResult | void,
  options?: {
    debug?: boolean;
    direction?: "out" | "in";
    maxDepth?: number;
    minDepth?: number; // TODO: as a shortcut where iterator is not called
  }
) => {
  let isWalkingStopped = false;
  let isCyclic = false;
  let deepestPath: Rel[] = [];
  const visitedDots = new Set<Dot["id"]>();
  const visitedRels = new Set<Rel["id"]>();

  const walkRecursive = (currentNode: Dot, currentPath: Rel[]) => {
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

    if (!options?.minDepth || currentPath.length >= options.minDepth) {
      const iteratorResult = iterator?.(currentNode, currentPath);

      if (iteratorResult === IteratorResult.STOP) {
        isWalkingStopped = true;
        return;
      }

      if (iteratorResult === IteratorResult.CONTINUE) {
        return;
      }
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
