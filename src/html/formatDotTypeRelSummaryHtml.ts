import { DotTypeRelPreview, DotTypePreview } from "../lib/format";
import { DotTypeRel } from "../types/DotTypeRel";

export type Options = {
  dotTypeRelPreview?: DotTypeRelPreview;
  dotTypePreview?: DotTypePreview;
};

export const formatDotTypeRelSummaryHtml = (
  entity: DotTypeRel,
  _options: Options,
  _depth: number
) => {
  return `<div style="display:inline-block">${`-${
    entity.verb ? `{${entity.verb}}` : ""
  }-> ${entity.to.name} (${entity.to.out.length})`}</div><br>`;
};
