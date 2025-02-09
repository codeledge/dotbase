import * as fs from "fs";
import * as path from "path";

type ToHtmlOptions = {
  title?: string;
  fileName?: string;
};

export const toMmdHtml = (content: string, options: ToHtmlOptions = {}) => {
  let template = fs.readFileSync(
    path.resolve(__dirname, "./mmdTemplate.html"),
    "utf8"
  );

  let data = template
    .replace("MMD_TITLE", options.title || "MMD")
    .replace("MMD_CONTENT", content);

  fs.writeFileSync(
    path.resolve(
      __dirname,
      `../../output/${options.fileName || options.title || "mmd"}.html`
    ),
    data
  );
};
