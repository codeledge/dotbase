import { describe, expect, test } from "@jest/globals";
import { parsePlainTextDotBase } from "../parse/parsePlainTextDotBase";
import { getPaths } from "./getPaths";

describe("getPaths", () => {
  test("isCyclic: false", async () => {
    const db = parsePlainTextDotBase(`
A[1]
\tB [2]
\t\tC [3]
\t\t\tZ [3]
\t\tK [3]
\t\t\tZ [3]
\t\t\tZ [4] 
`);

    const result = getPaths(
      db.getDot({ id: "A" }),
      undefined,
      db.findDots({ type: "4" })
    );

    expect(result.length).toBe(3);
  });
});
