import { describe, expect, test } from "@jest/globals";
import { DotBase } from "../src/DotBase";

describe("mergeDot", () => {
  const db = new DotBase();
  test("mergeDot", async () => {
    const a = db.createDot({
      id: "a",
      data: { a: 1 },
      typeNames: ["test"],
    });
    const b = db.mergeDot({
      id: "a",
      data: { a: 2, b: 2 },
      typeNames: ["test2", "test"],
    });

    const merged = db.getDot({ id: "a" });

    expect(merged.data).toStrictEqual({
      a: 2,
      b: 2,
    });

    expect(merged.types.length).toBe(2);
  });
});
