import { describe, expect, test } from "@jest/globals";
import { DotBase } from "../src/DotBase";

describe("updateDot", () => {
  const db = new DotBase();

  test("updateDot", async () => {
    const a = db.createDot({
      labels: ["test"],
    });
    const updated = db.updateDot(a.id, { labels: ["test2"] });

    expect(updated.labels[0].name).toBe("test2");
    expect(db.getDot(a.id).labels[0].name).toBe("test2");
  });
});
