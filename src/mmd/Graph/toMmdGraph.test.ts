import { describe, expect, test } from "@jest/globals";
import { toMmdGraph } from "./toMmdGraph";
import { toMmdHtml } from "../toMmdHtml";
import { parsePlainTextDotBase } from "../../parse/parsePlainTextDotBase";

describe("toMmdGraph", () => {
  const file = `
Orlando
	Vincenzo
		Pablo
			Pippo
		Giannis
			Orlando
`;

  test("toMmdGraph", async () => {
    const db = parsePlainTextDotBase(file);
    const mmd = toMmdGraph(db.getDots());
    toMmdHtml(mmd, { fileName: "graph" });

    expect(mmd.includes("graph")).toBe(true);
  });
});
