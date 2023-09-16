import { formatDotTypeHtml } from "../html/formatDotTypeHtml";
import { DotType } from "../types/DotType";
import { DotTypePreview, DotTypeRelPreview } from "./format";
import fs from "fs";

export const dotTypeToHtml = (
  roots: DotType[],
  {
    location = "./dot-types.html",
    dotTypeRelPreview,
    dotTypePreview,
  }: {
    location?: string;
    dotTypeRelPreview?: DotTypeRelPreview;
    dotTypePreview?: DotTypePreview;
  } = {}
) => {
  let content = `<body style="background:black;color:white"><h1>Graph</h1>`;
  content += roots.map((root) =>
    formatDotTypeHtml(root, {
      dotTypeRelPreview,
      dotTypePreview,
    })
  );

  content += `</body>`;

  try {
    fs.writeFileSync(location, content);
    // file written successfully
  } catch (err) {
    console.error(err);
  }
};
