import { describe, expect, test } from "@jest/globals";
import { DotBase } from "../src/DotBase";

describe("mergeDot", () => {
  const db = new DotBase();
  test("mergeDot", async () => {
    const a = db.createDot({
      id: "a",
      data: { a: 1 },
      labels: ["test"],
    });
    const b = db.mergeDot({
      id: "a",
      data: { a: 2, b: 2 },
      labels: ["test2", "test"],
    });

    const merged = db.getDot("a");

    expect(merged.data).toStrictEqual({
      a: 2,
      b: 2,
    });

    expect(merged.labels.length).toBe(2);
  });
});
