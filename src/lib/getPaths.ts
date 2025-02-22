import { isArray, isFunction } from "deverything";
import { Dot, isDot } from "../types/Dot";
import { Rel } from "../types/Rel";
import { walk, IteratorResult } from "./walk";

export const getPaths = (
  startMatcher: Dot | Dot[],
  pathFilter?: (rel: Rel[]) => boolean,
  endMatcher?: Dot | Dot[] | ((d: Dot) => boolean),
  {
    debug,
    direction,
    maxDepth,
    minDepth,
  }: {
    debug?: boolean;
    direction?: "out" | "in";
    maxDepth?: number;
    minDepth?: number;
  } = {}
) => {
  let paths: Rel[][] = [];

  if (!startMatcher) return paths; // TODO: return all paths

  let _startDots: Dot[] = [];
  if (isDot(startMatcher)) _startDots = [startMatcher];
  else if (isArray(startMatcher)) _startDots = startMatcher;

  walk(
    _startDots,
    (currentDot, currentPath) => {
      if (pathFilter && !pathFilter(currentPath))
        return IteratorResult.CONTINUE;

      if (isDot(endMatcher) && currentDot === endMatcher) {
        // console.log("currentNode", currentNode);
        paths.push(currentPath);
        return IteratorResult.CONTINUE;
      } else if (
        isArray(endMatcher) &&
        endMatcher.some((n) => n === currentDot)
      ) {
        paths.push(currentPath);
        return IteratorResult.CONTINUE;
      } else if (isFunction(endMatcher) && endMatcher(currentDot)) {
        paths.push(currentPath);
        return IteratorResult.CONTINUE;
      }
    },
    { minDepth, maxDepth, direction, debug }
  );

  return paths;
};
