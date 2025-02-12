import { DotRel } from "../types/DotRel";
import { DotTextOptions, formatDotText } from "./formatDotText";

export type RelTextOptions = {
  hideVerb?: boolean;
  hideFrom?: boolean;
  ghostFrom?: boolean;
  ghostTo?: boolean;
  orientation?: "right" | "down";
} & DotTextOptions;

export const formatRelText = (
  rel: DotRel,
  options?: RelTextOptions
): string => {
  let string = ``;

  // FROM
  if (!options?.hideFrom) {
    const formattedFrom = formatDotText(rel.from, options);
    string += options?.ghostFrom
      ? formattedFrom.replace(/./g, " ")
      : formattedFrom;
  }

  // REL
  string += " ";
  const formattedRelArrow = formatRelArrow(rel, options);
  string +=
    options?.ghostFrom && options?.ghostTo
      ? formattedRelArrow.replace(/./g, " ")
      : formattedRelArrow;
  string += " ";

  // TO
  const formattedTo = formatDotText(rel.to, options);
  string += options?.ghostTo ? formattedTo.replace(/./g, " ") : formattedTo;

  return string;
};

const formatRelArrow = (re: DotRel, options?: RelTextOptions): string => {
  let string = formatRelTail(options);
  if (re.verb && !options?.hideVerb) {
    string += `{${re.verb}}-`;
  }
  string += ">";

  return string;
};

const formatRelTail = (options?: RelTextOptions): string => {
  return `${options?.orientation === "down" ? "└" : "-"}`;
};
