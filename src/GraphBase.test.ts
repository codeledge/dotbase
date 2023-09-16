import { describe, expect, test } from "@jest/globals";
import { GraphBase } from "./GraphBase";

describe("GraphBase", () => {
  test("isCyclic", async () => {
    const gb = new GraphBase();
    const a = gb.upsertDot();
    const b = gb.upsertDot();
    const c = gb.upsertDot();
    const d = gb.upsertDot();
    gb.connectDots(a, b);
    gb.connectDots(b, c);
    gb.connectDots(c, a);
    gb.connectDots(c, d);
    const { isCyclic } = gb.walk();
    // console.log(gb.getNodes());
    // console.log(gb.getRels());
    expect(isCyclic).toBe(true);
  });

  test("unique", async () => {
    const gb = new GraphBase();

    const a = gb.upsertDot();
    const b = gb.upsertDot();
    gb.connectDots(a, b);
    gb.connectDots(a, b, { unique: true });
    gb.connectDots(a, b, { unique: false });
    expect(a.out.length).toBe(2);
  });
});
