import { describe, expect, test } from "@jest/globals";
import { parsePlainTextDotBase } from "../parse/parsePlainTextDotBase";
import { formatTreeText } from "./formatTreeText";
import { getPaths } from "../lib/getPaths";
import { formatPathsText } from "./formatPathText";
import { formatDotsText } from "./formatDotText";

describe("formatTreeText", () => {
  test("formatTreeText", async () => {
    const db = parsePlainTextDotBase(`
A[1]
\tshoots-> B [2]
\t\tC [3]
\t\t\tZ [3]
\t\tK [3]
\t\t\tZ [3]
\t\t\tZ [4] 
\t\t\t\tsubZ [4]
\tP [2]
`);

    const paths = getPaths(db.getDot("A"), undefined, db.getLeaves());

    console.log(formatDotsText(db.getLeaves()));
    console.log(formatPathsText(paths));
    console.log(formatTreeText(paths));

    expect(formatTreeText(paths)[0]).toBe("A");
  });

  test("circular basic", async () => {
    const db = parsePlainTextDotBase(`
A
\tB
\t\tA
`);

    const paths = getPaths(db.getDots(), undefined, db.getDots(), {
      minDepth: 1,
    });

    console.log(formatTreeText(paths));

    expect(formatTreeText(paths)[0]).toBe("A");
  });
});
