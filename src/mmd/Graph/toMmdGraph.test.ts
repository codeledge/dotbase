import { describe, expect, test } from "@jest/globals";
import { toMmdGraph } from "./toMmdGraph";
import { toMmdHtml } from "../toMmdHtml";
import { parsePlainTextDotBase } from "../../parse/parsePlainTextDotBase";

describe("toMmdGraph", () => {
  const file = `
dividendEvent [Event]
	-> getPos
		if pos = 0 & sold -> exit
		if pos = 0 -> isInWorkableHour 
			if true -> openOrdersCount 
				if 0 -> marketOrderBuy
		if pos > 1 -> posChecker
			-> getPnl
				if > 0.1 -> marketOrderSell
				if < -0.05 -> marketOrderSell
			if openPosiionTime > 1 day -> marketOrderSell
`;

  test("toMmdGraph", async () => {
    const db = parsePlainTextDotBase(file);
    const mmd = toMmdGraph(db.getDots(), { labelsAs: { Event: "braces" } });
    toMmdHtml(mmd, { fileName: "graph" });

    expect(mmd.includes("graph")).toBe(true);
  });
});
