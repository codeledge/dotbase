import { formatDotTypeHtml } from "./formatDotTypeHtml";
import { DotTypePreview, DotTypeRelPreview } from "../format/format";
import { DotType } from "../types/DotType";
import fs from "fs";

export const dotTypesToHtmlTree = (
  roots: DotType[],
  {
    location = "./output/dot-types-tree.html",
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
