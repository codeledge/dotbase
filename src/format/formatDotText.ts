import { Dot } from "../types/Dot";

export type DotTextOptions = {
  hideLabels?: boolean;
};

export const formatDotText = (
  dot: Dot,
  options: DotTextOptions = {}
): string => {
  let string = `${dot.id}`;
  if (!options.hideLabels) {
    string += ` ${dot.labels.map(({ name }) => `[${name}]`).join("")}`;
  }
  return string;
};

export const formatDotsText = (
  dots: Dot[],
  options: DotTextOptions = {}
): string => {
  return dots.map((dot) => formatDotText(dot, options)).join("\n");
};
