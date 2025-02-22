import { Rel } from "../types/Rel";
import { formatDotRelSummaryHtml } from "./formatDotRelSummaryHtml";

export const formatDotRelHtml = (entity: Rel, depth: number = 0): any => {
  if (entity.to.out.length === 0)
    return `&nbsp;&nbsp;&nbsp;&nbsp;` + formatDotRelSummaryHtml(entity);
  return `
  <details>
    <summary>${formatDotRelSummaryHtml(entity)}</summary>
    <div style="margin-left:10px">
    ${entity.to.out.map((rel) => formatDotRelHtml(rel, depth + 1)).join("\n")}
    </div>
  </details>`;
};
