import { describe, expect, test } from "@jest/globals";
import { parsePlainTextDotTypes } from "../parse/parsePlainTextDotTypes";
import { toMmdErDiagram } from "./toMmdErDiagram";
import { toMmdHtml } from "./toMmdHtml";

describe("toMmdErDiagram", () => {
  const file = `
User
	{canHaveMany} Post
		{canHaveMany} Comment
			{hasOne} Author
		{canHaveMany} Like
`;

  test("toMmdErDiagram", async () => {
    const db = parsePlainTextDotTypes(file);
    const mmd = toMmdErDiagram(db.getDotTypeRels(), { showVerb: true });
    toMmdHtml(mmd, { fileName: "er-diagram" });

    expect(mmd.includes("erDiagram")).toBe(true);
  });
});
