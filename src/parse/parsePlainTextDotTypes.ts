import { DotBase } from "../DotBase";
import { countLeadingTabs } from "./countLeadingTabs";
import { DotType } from "../types/DotType";
import { Verb } from "../const/Verb";
import { parseLine } from "./parseLine";

export const parsePlainTextDotTypes = (fileContent: string) => {
  const lines = fileContent.split("\n");

  let settings: {
    defaultVerb?: Verb;
  } = {};

  const db = new DotBase();
  let levelParent: Record<number, DotType> = {};
  for (const line of lines) {
    if (!line.trim()) continue;
    if (line.startsWith("{") && line.endsWith("}")) {
      settings = JSON.parse(line);
      continue;
    }

    const { name, verb } = parseLine(line);
    const level = countLeadingTabs(line);
    const dotType = db.getOrCreateDotType(name);
    if (level > 0) {
      const parent = levelParent[level - 1];
      if (parent) {
        db.connectDotTypes(parent, dotType, {
          verb: verb || settings.defaultVerb,
        });
      }
    }
    levelParent[level] = dotType;
  }

  return db;
};
