import { walk } from "../../lib/walk";
import { Dot } from "../../types/Dot";
import { DotRel } from "../../types/DotRel";
import { getMmdId } from "../getMmdId";

// https://mermaid.js.org/syntax/sequenceDiagram.html

export const toMmdSequenceDiagram = (
  dots: Dot[],
  options: {
    title?: string;
  } = {}
) => {
  let mmdString = ``;

  if (options?.title) {
    mmdString += `---\ntitle: ${options?.title}\n---\n`;
  }

  mmdString += `sequenceDiagram\n`;

  walk(dots, (_, currentPath) => {
    console.log(currentPath);
    if (currentPath.length === 0) return; // Lonely dots are not supported
    const lastRel = currentPath[currentPath.length - 1];
    mmdString += `\t${formatRel(lastRel)}\n`;
  });

  return mmdString;
};

const formatRel = (rel: DotRel) => {
  return `${getMmdId(rel.from.id)}${SequenceArrows.solidWithTip}${getMmdId(
    rel.to.id
  )}:"${rel.verb}"`;
};

export enum SequenceArrows {
  solidWithTip = "->>",
}
