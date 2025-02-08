import { DotPreview, DotRelPreview } from "../format/format";
import { Dot } from "../types/Dot";
import { DotRel } from "../types/DotRel";
import { formatDotRelHtml } from "./formatDotRelHtml";
import { formatDotSummaryHtml } from "./formatDotSummaryHtml";

export type Options = {
  relPreview?: DotRelPreview;
  nodePreview?: DotPreview;
  relFilter?: (rel: DotRel) => boolean;
};

export const formatDotHtml = (
  dot: Dot,
  options: Options,
  depth: number = 0
): any => {
  if (dot.out.length === 0) return formatDotSummaryHtml(dot, options, depth);
  return `
  <details>
    <summary>${formatDotSummaryHtml(dot, options, depth)}</summary>
    <div style="margin-left:10px">
    ${dot.out
      .filter(options.relFilter || (() => true))
      .map((rel) => {
        return formatDotRelHtml(rel, options, depth + 1);
      })
      .join("\n")}
    </div>
  </details>`;
};
