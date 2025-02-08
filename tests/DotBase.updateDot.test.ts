import { describe, expect, test } from "@jest/globals";
import { DotBase } from "../src/DotBase";

describe("updateDot", () => {
  const db = new DotBase();

  test("updateDot", async () => {
    const a = db.createDot({
      typeNames: ["test"],
    });
    const updated = db.updateDot(a.id, { typeNames: ["test2"] });

    expect(updated.types[0].name).toBe("test2");
    expect(db.getDot({ id: a.id }).types[0].name).toBe("test2");
  });
});
