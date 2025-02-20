import { describe, expect, test } from "@jest/globals";
import { parseLine } from "./parseLine";

describe("parseLine", () => {
  test("name", async () => {
    const parsed = parseLine("ciao");
    expect(parsed.name).toBe("ciao");
  });

  test("full", async () => {
    const parsed = parseLine(
      "  has {since:2023}-> un gran somaro {diocesi:'dicesi'} [burrone]"
    );
    expect(parsed.name).toBe("un gran somaro");
    expect(parsed.verb).toBe("has");
    expect(parsed.level).toBe(1);
    expect(parsed.relData).toStrictEqual({ since: 2023 });
    expect(parsed.dotData).toStrictEqual({ diocesi: "dicesi" });
    expect(parsed.labels).toStrictEqual(["burrone"]);
  });
});
