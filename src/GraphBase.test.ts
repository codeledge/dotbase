import { describe, expect, test } from "@jest/globals";
import { GraphBase } from "./GraphBase";

describe("GraphBase", () => {
  describe("addNode", () => {
    const gb = new GraphBase();

    test("instance", async () => {
      expect(gb instanceof GraphBase).toBeTruthy();
    });
  });
});
