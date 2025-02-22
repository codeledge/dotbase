import { describe, expect, test } from "@jest/globals";
import { DotBase } from "../src/DotBase";

describe("DotBase", () => {
  const db = new DotBase();
  test("DotBase", async () => {
    expect(db.dotMap.size).toBe(0);
    expect(db.relMap.size).toBe(0);
    expect(db.title).toBeUndefined();
  });
});
