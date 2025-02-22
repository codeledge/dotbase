import { LabelRel } from "../../types/LabelRel";

export const toMmdErDiagram = (
  labelRels: LabelRel[],
  options: {
    showVerb?: boolean;
  } = {}
) => {
  let mmdString = `erDiagram\n`;

  labelRels.forEach((dotTypeRel) => {
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
