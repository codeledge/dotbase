import { describe, expect, test } from "@jest/globals";
import { DotBase } from "../src/DotBase";

describe("createDot", () => {
  const db = new DotBase();
  test("createDot", async () => {
    const a = db.createDot();
    const b = db.createDot();
    expect(a.id).not.toBe(b.id);

    db.createDot({ id: "z" });
    expect(() => db.createDot({ id: "z" })).toThrow();
    const c = db.createDot({
      typeNames: ["test"],
    });
    const d = db.createDot({
      typeNames: ["test2", "test"],
    });
    expect(c.id).not.toBe(d.id);
    expect(c.types.length).toBe(1);
    expect(d.types.length).toBe(2);
    expect(d.types.some((type) => type === c.types[0])).toBe(true);
  });
});
