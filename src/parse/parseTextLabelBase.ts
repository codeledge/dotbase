import { DotBase } from "../DotBase";
import { countLeadingTabs } from "./countLeadingTabs";
import { Label } from "../types/Label";
import { Verb } from "../const/Verb";
import { parseLine } from "./parseLine";

export const parseTextLabelBase = (fileContent: string) => {
  const lines = fileContent.split("\n");

  let settings: {
    defaultVerb?: Verb;
  } = {};

  const db = new DotBase();
  let levelParent: Record<number, Label> = {};
  for (const line of lines) {
    if (!line.trim()) continue;
    if (line.startsWith("{") && line.endsWith("}")) {
      settings = JSON.parse(line);
      continue;
    }

    const { name, verb } = parseLine(line);
    if (!name) continue; // Labels cannot have empty names
    const level = countLeadingTabs(line);
    const dotType = db.mergeLabel(name);
    if (level > 0) {
      const parent = levelParent[level - 1];
      if (parent) {
        db.connectLabels(parent, dotType, {
          verb: verb || settings.defaultVerb,
        });
      }
    }
    levelParent[level] = dotType;
  }

  return db;
};
