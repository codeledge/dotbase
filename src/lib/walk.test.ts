import { describe, expect, test } from "@jest/globals";
import { parsePlainTextDotBase } from "../parse/parsePlainTextDotBase";
import { walk } from "./walk";
import { formatPathText } from "../format/formatPathText";

describe("walk", () => {
  test("isCyclic: false", async () => {
    const db = parsePlainTextDotBase(`
A[1]
\tB [2]
\t\tC [3]
`);
    const roots = db.getRoots();

    const result = walk(roots);

    expect(result.isCyclic).toBe(false);
    expect(result.isWalkingStopped).toBe(false);
  });

  test("isCyclic: true", async () => {
    const db = parsePlainTextDotBase(`
A[1]
\tB [2]
\t\tC [3]
\t\tA [3]
\t\t\tZ [3]
`);
    const dots = db.getDots();

    const result = walk(dots);

    expect(result.isCyclic).toBe(true);
    expect(result.isWalkingStopped).toBe(false);
  });

  test("deepestPath length", async () => {
    const db = parsePlainTextDotBase(`
A[1]
\tB [2]
\t\tA [3]
`);
    const dots = db.getDots();

    const result = walk(dots);

    console.log(formatPathText(result.deepestPath));

    expect(result.deepestPath.length).toBe(2);
  });
});
