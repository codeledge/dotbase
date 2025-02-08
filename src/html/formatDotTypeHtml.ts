import { DotType } from "../types/DotType";
import { DotTypePreview, DotTypeRelPreview } from "../format/format";
import { formatDotTypeRelHtml } from "./formatDotTypeRelHtml";
import { formatDotTypeSummaryHtml } from "./formatDotTypeSummaryHtml";

export type Options = {
  dotTypeRelPreview?: DotTypeRelPreview;
  dotTypePreview?: DotTypePreview;
};

export const formatDotTypeHtml = (
  dotType: DotType,
  options: Options,
  depth: number = 0
): any => {
  if (dotType.out.length === 0)
    return formatDotTypeSummaryHtml(dotType, options, depth);
  return `
  <details>
    <summary>${formatDotTypeSummaryHtml(dotType, options, depth)}</summary>
    <div style="margin-left:10px">
    ${dotType.out
      .map((rel) => {
        return formatDotTypeRelHtml(rel, options, depth + 1);
      })
      .join("\n")}
    </div>
  </details>`;
};
