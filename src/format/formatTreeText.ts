import { formatRelText, RelTextOptions } from "./formatRelText";
import { DotTextOptions } from "./formatDotText";
import { Paths } from "../types/Path";

export type PathTextOptions = RelTextOptions & DotTextOptions;

export const formatTreeText = (
  paths: Paths,
  options?: PathTextOptions
): string => {
  return paths
    .map((path, pathIndex) => {
      let startBranching = false;
      let endBranching = -1;
      return path
        .map((rel, relIndex) => {
          const ghostFrom =
            pathIndex > 0 &&
            relIndex === 0 &&
            paths[pathIndex - 1][0].from.id === rel.from.id;

          if (ghostFrom) startBranching = true;

          const ghostTo =
            pathIndex > 0 &&
            startBranching &&
            endBranching === -1 &&
            paths[pathIndex - 1][relIndex].id === rel.id; // to can be the same

          if (startBranching && endBranching === -1 && !ghostTo)
            endBranching = relIndex;

          const orientation = endBranching === relIndex ? "down" : "right";
          return formatRelText(rel, {
            ...options,
            hideFrom: relIndex !== 0,
            ghostFrom,
            ghostTo,
            orientation,
          });
        })
        .join("");
    })
    .join("\n");
};
