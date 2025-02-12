import { describe, expect, test } from "@jest/globals";
import { parsePlainTextDotBase } from "../parse/parsePlainTextDotBase";
import { formatTreeText } from "./formatTreeText";
import { getPaths } from "../lib/getPaths";

describe("formatTreeText", () => {
  test("formatTreeText", async () => {
    const db = parsePlainTextDotBase(`
A[1]
\t{shoots} B [2]
\t\tC [3]
\t\t\tZ [3]
\t\tK [3]
\t\t\tZ [3]
\t\t\tZ [4] 
\t\t\t\tsubZ [4]
\tP [2]
`);

    const result = getPaths(db.getDot({ id: "A" }), undefined, db.getLeaves());

    console.log(formatTreeText(result));

    expect(formatTreeText(result)[0]).toBe("A");
  });
});
