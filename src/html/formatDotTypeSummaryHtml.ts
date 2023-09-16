import { DotType } from "../types/DotType";

export const formatDotTypeSummaryHtml = (
  dotType: DotType,
  _options: any,
  _depth: number
) => {
  return `<div style="display:inline-block">${dotType.name} (${dotType.out.length})</div><br>`;
};
