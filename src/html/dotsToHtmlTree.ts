import { formatDotHtml } from "./formatDotHtml";
import { Dot } from "../types/Dot";
import fs from "fs";

export const dotsToHtmlTree = (
  roots: Dot[],
  {
    location = "./output/dots-tree.html",
  }: {
    location?: string;
  } = {}
) => {
  try {
    let writer = fs.createWriteStream(location);

    writer.write(
      `<body style="background:black;color:white"><h1>DotBase To Html</h1>`
    );
    roots.forEach((root) => {
      writer.write(formatDotHtml(root));
    });

    writer.write(`</body>`);
  } catch (err) {
    console.error(err);
  }
};
