import { formatRelText } from "../format/formatRelText";
import { Rel } from "../types/Rel";

export const formatDotRelSummaryHtml = (rel: Rel) => {
  return `<div style="display:inline-block">${formatRelText(rel, {
    hideFrom: true,
  })}</div><br>`;
};
