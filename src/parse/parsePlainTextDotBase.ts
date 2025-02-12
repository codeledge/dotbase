import { DotBase } from "../DotBase";
import { countLeadingTabs } from "./countLeadingTabs";
import { Dot } from "../types/Dot";
import { parseLine } from "./parseLine";

export const parsePlainTextDotBase = (fileContent: string) => {
  const lines = fileContent.split("\n");

  const db = new DotBase();
  let levelParent: Record<number, Dot> = {};
  for (const line of lines) {
    if (!line.trim()) continue;
    const { name, verb, labels } = parseLine(line);
    const level = countLeadingTabs(line);
    const dot = db.mergeDot({
      id: name,
      typeNames: labels,
    });
    if (level > 0) {
      const parent = levelParent[level - 1];
      if (parent) {
        db.connectDots(parent, dot, {
          verb,
        });
      }
    }
    levelParent[level] = dot;
  }

  return db;
};
