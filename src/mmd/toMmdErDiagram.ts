import { DotTypeRel } from "../types/DotTypeRel";

export const toMmdErDiagram = (
  dotTypeRels: DotTypeRel[],
  options: {
    showVerb?: boolean;
  } = {}
) => {
  let mmdString = `erDiagram\n`;

  dotTypeRels.forEach((dotTypeRel) => {
    mmdString += `\t${formatERName(dotTypeRel.from.name)} ${
      ERArrows.zeroOrOneLeft
    }--${ERArrows.zeroOrOneRight} ${formatERName(dotTypeRel.to.name)} : ${
      options.showVerb ? `"${dotTypeRel.verb}"` : `""`
    }\n`;
  });

  return mmdString;
};

const formatERName = (name: string) => name.replace(/\s/g, "-");

export enum ERArrows {
  zeroOrOneLeft = "|o",
  zeroOrOneRight = "o|",
}
