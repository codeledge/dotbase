import { DotPreview } from "../lib/format";
import { Dot } from "../types/Dot";

export type Options = {
  nodePreview?: DotPreview;
};

export const formatDotSummaryHtml = (
  entity: Dot,
  _options: Options,
  _depth: number
) => {
  return `<div style="display:inline-block">${entity.id} ${entity.types.map(
    ({ name }) => `[${name}]`
  )}</div><br>`;
};
