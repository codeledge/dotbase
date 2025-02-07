import { describe, expect, test } from "@jest/globals";
import { GraphBase } from "./GraphBase";

describe("GraphBase", () => {
  const gb = new GraphBase();
  test("createDot", async () => {
    const a = gb.createDot();
    const b = gb.createDot();
    expect(a.id).not.toBe(b.id);

    gb.createDot({ id: "z" });
    expect(() => gb.createDot({ id: "z" })).toThrow();
    const c = gb.createDot({
      typeNames: ["test"],
    });
    const d = gb.createDot({
      typeNames: ["test2", "test"],
    });
    expect(c.id).not.toBe(d.id);
    expect(c.types.length).toBe(1);
    expect(d.types.length).toBe(2);
    expect(d.types.some((type) => type === c.types[0])).toBe(true);
  });

  test("updateDot", async () => {
    const a = gb.createDot({
      typeNames: ["test"],
    });
    const updated = gb.updateDot(a.id, { typeNames: ["test2"] });

    expect(updated.types[0].name).toBe("test2");
    expect(gb.getDot({ id: a.id }).types[0].name).toBe("test2");
  });
});
