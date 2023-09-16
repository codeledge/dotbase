import { formatDotHtml } from "../html/formatDotHtml";
import { Dot } from "../types/Dot";
import { DotRel } from "../types/DotRel";
import { DotRelPreview, DotPreview } from "./format";
import fs from "fs";

export const dotToHtml = (
  roots: Dot[],
  {
    location = "./dot.html",
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

    writer.write(`<body style="background:black;color:white"><h1>Graph</h1>`);
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
