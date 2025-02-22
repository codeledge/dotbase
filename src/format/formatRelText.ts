import { Rel } from "../types/Rel";
import { DotTextOptions, formatDotText } from "./formatDotText";

export type RelTextOptions = {
  hideVerb?: boolean;
  hideFrom?: boolean;
  ghostFrom?: boolean;
  ghostTo?: boolean;
  orientation?: "right" | "down";
} & DotTextOptions;

export const formatRelText = (rel: Rel, options?: RelTextOptions): string => {
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

const formatRelArrow = (rel: Rel, options?: RelTextOptions): string => {
  let string = formatRelTail(options);
  if (rel.verb && !options?.hideVerb) {
    string += `${rel.verb}-`;
  }
  string += ">";

  return string;
};

const formatRelTail = (options?: RelTextOptions): string => {
  return `${options?.orientation === "down" ? "└" : "-"}`;
};
