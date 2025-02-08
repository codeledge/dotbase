import { describe, expect, test } from "@jest/globals";
import { parsePlainTextDotBase } from "../src/parse/parsePlainTextDotBase";
import { dotsToHtmlTree } from "../src/html/dotsToHtmlTree";

describe("parsePlainTextDotBase", () => {
  const file = `
Giannis Antetokounmpo [1]
\tKhris Middleton [2]
\t\tJrue Holiday [3]
\t\t\tBrook Lopez [4][3]
\t\t\t\tPat Connaughton [2]
\t\t\t\tPat Connaughton [1][5]
\t\tBobby Portis
\tBobby P [6]
`;

  test("parsePlainTextDotBase", async () => {
    const db = parsePlainTextDotBase(file);
    // dotsToHtmlTree(db.getRoots());

    expect(db.dots.size).toBe(7);
    expect(db.dotTypes.size).toBe(6);
  });
});
