import { Rel } from "../types/Rel";
import { formatRelText, RelTextOptions } from "./formatRelText";
import { DotTextOptions } from "./formatDotText";

export type PathTextOptions = RelTextOptions & DotTextOptions;

export const formatPathText = (
  path: Rel[],
  options?: PathTextOptions
): string => {
  return path
    .map((rel, index) =>
      formatRelText(rel, { ...options, hideFrom: index !== 0 })
    )
    .join("");
};

export const formatPathsText = (
  paths: Rel[][],
  options?: PathTextOptions
): string => {
  return paths.map((path) => formatPathText(path, options)).join("\n");
};
