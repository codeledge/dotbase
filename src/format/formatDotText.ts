import { Dot } from "../types/Dot";

export const formatDotText = (
  dot: Dot,
  options?: {
    showTypes?: boolean;
  }
): any => {
  let string = `${dot.id}`;
  if (options?.showTypes) {
    string += ` ${dot.types.map((t) => `[${t.name}]`).join("")}`;
  }
  return string;
};
