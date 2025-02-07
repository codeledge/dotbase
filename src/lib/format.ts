import { PlainObject, isBoolean } from "deverything";
import { pick } from "./pick";
import { DotType } from "../types/DotType";
import { Dot } from "../types/Dot";
import { DotRel } from "../types/DotRel";
import { DotTypeRel } from "../types/DotTypeRel";

export type FormatNodeOptions = Partial<Record<keyof Dot, boolean>>;

export type DotRelPreview = (r: DotRel) => string;
export type DotPreview = (n: Dot) => string;

export type DotTypePreview = (r: DotType) => string;
export type DotTypeRelPreview = (n: DotTypeRel) => string;

export type NodeSelect =
  | Partial<{
      preview: (n: Dot) => string;
      id: boolean;
      data: boolean | PlainObject;
      types: boolean | DotTypeSelect;
      in: boolean | RelSelect;
      out: boolean | RelSelect;
    }>
  | boolean
  | "COMPACT";

export type RelSelect =
  | Partial<{
      id: boolean;
      data: boolean;
      verb: boolean;
      from: boolean | NodeSelect;
      to: boolean | NodeSelect;
    }>
  | boolean;

export type DotTypeSelect =
  | Partial<{
      name: boolean;
    }>
  | boolean;

export const formatNode = (node: Dot, options?: NodeSelect): any => {
  if (isBoolean(options)) return options ? node : undefined;
  if (options === "COMPACT")
    return `${node.id} ${node.types.map((t) => `[${t.name}]`).join("")}`;

  return {
    ...(options?.preview && { preview: options.preview(node) }),
    ...(options?.id && { id: node.id }),
    ...(options?.types && { types: formatDotTypes(node.types, options.types) }),
    ...(options?.data && {
      data: isBoolean(options.data)
        ? options.data
        : pick(node.data, options.data),
    }),
    ...(options?.in && {
      in: node.in.map<any>((rel) => formatRel(rel, options?.in)),
    }),
    ...(options?.out && {
      out: node.out.map<any>((rel) => formatRel(rel, options?.out)),
    }),
  };
};

export const formatDotType = (
  dotType: DotType,
  options?: DotTypeSelect
): any => {
  if (isBoolean(options)) return options ? dotType : undefined;
  return {
    ...(options?.name && { name: dotType.name }),
  };
};

export const formatNodes = (nodes: Dot[], options?: NodeSelect): any => {
  if (isBoolean(options)) return options ? nodes : undefined;

  return nodes.map((node) => formatNode(node, options));
};

export const formatDotTypes = (
  dotTypes: DotType[],
  options?: DotTypeSelect
): any => {
  if (isBoolean(options)) return options ? dotTypes : undefined;

  return dotTypes.map((dotType) => formatDotType(dotType, options));
};

export const formatRel = (rel: DotRel, options?: RelSelect): any => {
  if (isBoolean(options)) return options ? rel : undefined;

  return {
    ...(options?.id && { id: rel.id }),
    ...(options?.data && { data: rel.data }),
    ...(options?.verb && { verb: rel.verb }),
    ...(options?.from && { from: formatNode(rel.from, options?.from) }),
    ...(options?.to && { to: formatNode(rel.to, options?.to) }),
  };
};

export const formatPath = (path: DotRel[], options?: RelSelect): any => {
  if (isBoolean(options)) return options ? path : undefined;

  return path.map((rel) => formatRel(rel, options));
};

export const formatPaths = (paths: DotRel[][], options?: RelSelect): any => {
  if (isBoolean(options)) return options ? paths : undefined;

  return paths.map((path) => formatPath(path, options));
};
