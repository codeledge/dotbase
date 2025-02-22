import { Dot } from "../types/Dot";
import { formatDotRelHtml } from "./formatDotRelHtml";
import { formatDotSummaryHtml } from "./formatDotSummaryHtml";

export const formatDotHtml = (dot: Dot, depth: number = 0): any => {
  if (dot.out.length === 0) return formatDotSummaryHtml(dot);
  return `
  <details>
    <summary>${formatDotSummaryHtml(dot)}</summary>
    <div style="margin-left:10px">
    ${dot.out
      .map((rel) => {
        return formatDotRelHtml(rel, depth + 1);
      })
      .join("\n")}
    </div>
  </details>`;
};
