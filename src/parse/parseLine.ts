import { PlainObject } from "deverything";
import { parse } from "relaxed-json";

export const parseLine = (
  input: string
): {
  name?: string;
  verb?: string;
  level?: number;
  labels?: string[];
  dotData?: PlainObject;
  relData?: PlainObject;
} => {
  let level = 0;
  let name: string | undefined = undefined;
  let verb: string | undefined = undefined;
  let labels: string[] | undefined = undefined;
  let dotData: PlainObject | undefined = undefined;
  let relData: PlainObject | undefined = undefined;

  const levelInfo = extractLevel(input);
  input = levelInfo.rest;
  level = levelInfo.level;

  let dotString = "";
  let relString = "";
  const [left, right] = input.split("->");
  if (right) {
    relString = left;
    dotString = right;
  } else {
    dotString = left;
  }

  if (relString) {
    const relPropsInfo = extractProps(relString);
    relString = relPropsInfo.rest;
    relData = relPropsInfo.props;

    verb = relString.trim();
  }

  const dotPropsInfo = extractProps(dotString);
  dotString = dotPropsInfo.rest;
  dotData = dotPropsInfo.props;

  const labelsInfo = extractLabels(dotString);
  dotString = labelsInfo.rest;
  labels = labelsInfo.labels;

  name = dotString.trim();

  return {
    name,
    verb,
    labels,
    level,
    dotData,
    relData,
  };
};

const extractLevel = (input: string): { level: number; rest: string } => {
  if (input.startsWith(" ")) {
    console.warn("Error: line starts with a space, it should start with a tab");
  }
  const leadingIndentMatch = input.match(/^(?:\t| {2})+/);
  if (leadingIndentMatch) {
    const leadingIndent = leadingIndentMatch[0];

    // Match each token: either a tab or a pair of spaces
    const tokens = leadingIndent.match(/\t| {2}/g) || [];
    return {
      rest: input.replace(leadingIndent, "").trim(),
      level: tokens.length,
    };
  } else {
    return {
      rest: input,
      level: 0,
    };
  }
};

const extractLabels = (input: string): { labels: string[]; rest: string } => {
  const labelRegex = /\[([^\]]*)\]/g;
  const labels: string[] = [];
  // Extract labels
  let match;
  while ((match = labelRegex.exec(input)) !== null) {
    labels.push(match[1]);
  }

  return {
    rest: input.replace(labelRegex, "").trim(),
    labels,
  };
};

const extractProps = (
  input: string
): { rest: string; props: PlainObject | undefined } => {
  const regex = /(\{[^{}]*\})/;
  const match = input.match(regex);

  if (match) {
    const jsonStr = match[1];

    try {
      const obj = parse(jsonStr);
      return {
        rest: input.replace(regex, "").trim(),
        props: obj,
      };
    } catch (e) {
      console.error("RJSON parse error:", e);
      return {
        rest: input,
        props: undefined,
      };
    }
  }
  return {
    rest: input,
    props: undefined,
  };
};
