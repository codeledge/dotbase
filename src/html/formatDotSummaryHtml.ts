import { DotPreview } from "../format/format";
import { formatDotText } from "../format/formatDotText";
import { Dot } from "../types/Dot";

export type Options = {
  nodePreview?: DotPreview;
};

export const formatDotSummaryHtml = (
  entity: Dot,
  _options: Options,
  _depth: number
) => {
  return `<div style="display:inline-block">${formatDotText(entity, {
    showTypes: true,
  })}</div><br>`;
};
