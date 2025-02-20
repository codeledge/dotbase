import { walk } from "../../lib/walk";
import { Dot } from "../../types/Dot";
import { DotRel } from "../../types/DotRel";
import { getMmdId } from "../getMmdId";

// https://mermaid.js.org/syntax/flowchart.html
export type Shape =
  | "bolt"
  | "brace-r"
  | "brace"
  | "braces"
  | "circle"
  | "cyl"
  | "delay"
  | "diam"
  | "docs"
  | "fork"
  | "hex"
  | "hourglass"
  | "notch-rect"
  | "rect"
  | "rounded"
  | "stadium"
  | "subproc"
  | "tri";

export const toMmdGraph = (
  dots: Dot[],
  options: {
    title?: string;
    labelsAs?: Record<string, Shape>;
  } = {}
) => {
  let mmdString = ``;

  if (options?.title) {
    mmdString += `---\ntitle: ${options?.title}\n---\n`;
  }

  mmdString += `graph\n`; // or flowchart, it's the same

  walk(dots, (_, currentPath) => {
    if (currentPath.length === 0) return; // TODO: fix this when a lone dot is passed
    const lastRel = currentPath[currentPath.length - 1];
    mmdString += `\t${formatBlock(lastRel.from, options)} ${formatVerb(
      lastRel,
      {
        showVerb: true,
      }
    )} ${formatBlock(lastRel.to, options)}\n`;
  });

  return mmdString;
};

const formatBlock = (
  dot: Dot,
  options: { labelsAs?: Record<string, Shape> } = {}
) => {
  return `${getMmdId(dot.id)}@${JSON.stringify({
    shape: options.labelsAs?.[dot.types[0]?.name] || "rect",
    label: dot.id,
  })}`;
};

const formatVerb = (rel: DotRel, options: { showVerb?: boolean } = {}) => {
  let relString = `${GraphArrows.solidWithTip}`;
  if (options.showVerb && rel.verb) relString += `|"\`${rel.verb}\`"|`;

  return relString;
};

export enum GraphArrows {
  solidWithTip = "-->",
  solidWithoutTip = "---",
  dottedWithTip = "-.->",
  thickWithTip = "==>",
}
