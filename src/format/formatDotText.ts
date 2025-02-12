import { Dot } from "../types/Dot";

export type DotTextOptions = {
  hideTypes?: boolean;
};

export const formatDotText = (dot: Dot, options: DotTextOptions = {}): any => {
  let string = `${dot.id}`;
  if (!options.hideTypes) {
    string += ` ${dot.types.map((t) => `[${t.name}]`).join("")}`;
  }
  return string;
};
