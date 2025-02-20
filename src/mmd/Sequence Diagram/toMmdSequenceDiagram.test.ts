import { describe, expect, test } from "@jest/globals";
import { toMmdSequenceDiagram } from "./toMmdSequenceDiagram";
import { toMmdHtml } from "../toMmdHtml";
import { parsePlainTextDotBase } from "../../parse/parsePlainTextDotBase";

describe("toMmdSequenceDiagram", () => {
  const file = `
UI
	opens dialog -> UI
UI
	sends price, payment type, location -> Backend
Backend
	returns enabled payment types and selected tab -> UI
UI
	selects tab -> UI
UI
	renders form -> UI
UI
	submits payment -> Provider
Provider
	notifies -> Backend
Backend
	notifies -> UI
UI
	renders success -> UI
	renders error -> UI
`;

  test("toMmdSequenceDiagram", async () => {
    const db = parsePlainTextDotBase(file);
    const mmd = toMmdSequenceDiagram(db.getDots());
    toMmdHtml(mmd, { fileName: "sequence" });

    expect(mmd.includes("sequenceDiagram")).toBe(true);
  });
});
