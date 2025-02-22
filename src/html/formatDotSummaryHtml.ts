import { formatDotText } from "../format/formatDotText";
import { Dot } from "../types/Dot";

export const formatDotSummaryHtml = (entity: Dot) => {
  return `<div style="display:inline-block">${formatDotText(entity, {
    hideLabels: false,
  })}</div><br>`;
};
