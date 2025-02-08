import { formatDotHtml } from "./formatDotHtml";
import { Dot } from "../types/Dot";
import { DotRel } from "../types/DotRel";
import { DotRelPreview, DotPreview } from "../format/format";
import fs from "fs";

export const dotsToHtmlTree = (
  roots: Dot[],
  {
    location = "./output/dots-tree.html",
    relPreview,
    nodePreview,
    relFilter,
  }: {
    location?: string;
    relPreview?: DotRelPreview;
    nodePreview?: DotPreview;
    relFilter?: (rel: DotRel) => boolean;
  } = {}
) => {
  try {
    let writer = fs.createWriteStream(location);

    writer.write(
      `<body style="background:black;color:white"><h1>DotBase To Html</h1>`
    );
    roots.forEach((root) => {
      writer.write(
        formatDotHtml(root, {
          relPreview,
          nodePreview,
          relFilter,
        })
      );
    });

    writer.write(`</body>`);
  } catch (err) {
    console.error(err);
  }
};
