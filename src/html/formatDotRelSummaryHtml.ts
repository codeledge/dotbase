import { DotRelPreview, DotPreview } from "../lib/format";
import { DotRel } from "../types/DotRel";
import { formatDotSummaryHtml } from "./formatDotSummaryHtml";

export type Options = {
  relPreview?: DotRelPreview;
  nodePreview?: DotPreview;
};

export const formatDotRelSummaryHtml = (
  entity: DotRel,
  options: Options,
  _depth: number
) => {
  return `<div style="display:inline-block">${`-{${
    options.relPreview?.(entity) || ""
  }}-> ${formatDotSummaryHtml(entity.to, options, _depth)}`}</div><br>`;
};
