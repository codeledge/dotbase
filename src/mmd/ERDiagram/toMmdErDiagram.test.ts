import { describe, expect, test } from "@jest/globals";
import { parseTextLabelBase } from "../../parse/parseTextLabelBase";
import { toMmdErDiagram } from "./toMmdErDiagram";
import { toMmdHtml } from "../toMmdHtml";

describe("toMmdErDiagram", () => {
  const file = `
User
	{canHaveMany} Post
		{canHaveMany} Comment
			{hasOne} Author
		{canHaveMany} Like
`;

  test("toMmdErDiagram", async () => {
    const db = parseTextLabelBase(file);
    const mmd = toMmdErDiagram(db.getLabelRels(), { showVerb: true });
    toMmdHtml(mmd, { fileName: "er-diagram" });

    expect(mmd.includes("erDiagram")).toBe(true);
  });
});
