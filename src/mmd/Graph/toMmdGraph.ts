import { walk } from "../../lib/walk";
import { Dot } from "../../types/Dot";
import { DotRel } from "../../types/DotRel";

export const toMmdGraph = (dots: Dot[]) => {
  let mmdString = `graph\n`; // or flowchart, it's the same

  walk(dots, (currentDot, currentPath) => {
    if (currentPath.length === 0) return; // TODO: fix this when a lone dot is passed
    const lastRel = currentPath[currentPath.length - 1];
    mmdString += `\t${formatBlock(lastRel.from)} ${
      GraphArrows.solidWithTip
    }${formatVerb(lastRel, { showVerb: true })} ${formatBlock(lastRel.to)}\n`;
  });

  return mmdString;
};

const formatBlock = (target: Dot) => {
  return `${target.id}["${target.id}"]`;
};

const formatVerb = (rel: DotRel, options: { showVerb?: boolean } = {}) => {
  return options.showVerb && rel.verb ? `|${rel.verb}|` : "";
};

export enum GraphArrows {
  solidWithTip = "-->",
  solidWithoutTip = "---",
  dottedWithTip = "-.->",
  thickWithTip = "==>",
}
