import { isArray, isFunction } from "deverything";
import { Dot, isDot } from "../types/Dot";
import { DotRel } from "../types/DotRel";
import { walk, IteratorResult } from "./walk";

export const getPaths = (
  startMatcher: Dot | Dot[],
  pathFilter?: (rel: DotRel[]) => boolean,
  endMatcher?: Dot | Dot[] | ((d: Dot) => boolean),
  { maxDepth, direction }: { maxDepth?: number; direction?: "out" | "in" } = {}
) => {
  let paths: DotRel[][] = [];

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
    { maxDepth, direction }
  );

  return paths;
};
