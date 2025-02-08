import { describe, expect, test } from "@jest/globals";
import { parsePlainTextDotTypes } from "../src/parse/parsePlainTextDotTypes";
import { dotTypesToHtmlTree } from "../src/html/dotTypesToHtmlTree";

describe("parsePlainTextDotTypes", () => {
  const file = `
{"defaultVerb": "canBe"}
Company Worker
	Team Member
		Employee
			Intern
			C-suite
		Contractor
	3rd Party
		Vendor
		Freelancer
	Support
		Cleaner
		Security Guard
`;

  test("parsePlainTextDotBase", async () => {
    const db = parsePlainTextDotTypes(file);
    dotTypesToHtmlTree(db.getDotTypeRoots());

    expect(db.dots.size).toBe(0);
    expect(db.getDotTypeRoots().length).toBe(1);
    expect(db.dotTypes.size).toBe(12);
  });
});
