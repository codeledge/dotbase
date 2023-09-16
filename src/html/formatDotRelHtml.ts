import { DotRelPreview, DotPreview } from "../lib/format";
import { DotRel } from "../types/DotRel";
import { formatDotRelSummaryHtml } from "./formatDotRelSummaryHtml";

export type Options = {
  relPreview?: DotRelPreview;
  nodePreview?: DotPreview;
  relFilter?: (rel: DotRel) => boolean;
};

export const formatDotRelHtml = (
  entity: DotRel,
  options: Options,
  depth: number = 0
): any => {
  if (entity.to.out.length === 0)
    return (
      `&nbsp;&nbsp;&nbsp;&nbsp;` +
      formatDotRelSummaryHtml(entity, options, depth)
    );
  return `
  <details>
    <summary>${formatDotRelSummaryHtml(entity, options, depth)}</summary>
    <div style="margin-left:10px">
    ${entity.to.out
      .filter(options.relFilter || (() => true))
      .map((rel) => formatDotRelHtml(rel, options, depth + 1))
      .join("\n")}
    </div>
  </details>`;
};
