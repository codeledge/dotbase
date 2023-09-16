import { DotTypeRelPreview, DotTypePreview } from "../lib/format";
import { DotTypeRel } from "../types/DotTypeRel";
import { formatDotTypeRelSummaryHtml } from "./formatDotTypeRelSummaryHtml";

export type Options = {
  dotTypeRelPreview?: DotTypeRelPreview;
  dotTypePreview?: DotTypePreview;
};

export const formatDotTypeRelHtml = (
  entity: DotTypeRel,
  options: Options,
  depth: number = 0
): any => {
  if (entity.to.out.length === 0)
    return (
      `&nbsp;&nbsp;&nbsp;` + formatDotTypeRelSummaryHtml(entity, options, depth)
    );
  return `
  <details>
    <summary>${formatDotTypeRelSummaryHtml(entity, options, depth)}</summary>
    <div style="margin-left:10px">
    ${entity.to.out
      .map((rel) => {
        return formatDotTypeRelHtml(rel, options, depth + 1);
      })
      .join("\n")}
    </div>
  </details>`;
};
