import { describe, expect, test } from "@jest/globals";
import { DotBase } from "../src/DotBase";

describe("DotBase", () => {
  const db = new DotBase();
  test("DotBase", async () => {
    expect(db.dots.size).toBe(0);
    expect(db.rels.size).toBe(0);
  });
});
