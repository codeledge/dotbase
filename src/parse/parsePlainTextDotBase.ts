import { DotBase } from "../DotBase";
import { countLeadingTabs } from "./countLeadingTabs";
import { Dot } from "../types/Dot";

export const parsePlainTextDotBase = (fileContent: string) => {
  const lines = fileContent.split("\n");

  const db = new DotBase();
  let levelParent: Record<number, Dot> = {};
  for (const line of lines) {
    if (!line.trim()) continue;
    const { name, labels } = extractLabels(line);
    const level = countLeadingTabs(line);
    const dot = db.mergeDot({
      id: name,
      typeNames: labels,
    });
    if (level > 0) {
      const parent = levelParent[level - 1];
      if (parent) {
        db.connectDots(parent, dot);
      }
    }
    levelParent[level] = dot;
  }

  return db;
};

function extractLabels(input: string): { name: string; labels: string[] } {
  const labelRegex = /\[([^\]]*)\]/g;
  const labels: string[] = [];

  // Extract labels
  let match;
  while ((match = labelRegex.exec(input)) !== null) {
    labels.push(match[1]);
  }

  // Remove labels from the name
  const name = input.replace(/\s*\[[^\]]*\]/g, "").trim();

  return { name, labels };
}
