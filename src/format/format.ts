import { PlainObject, isBoolean } from "deverything";
import { DotType } from "../types/DotType";
import { Dot } from "../types/Dot";
import { DotRel } from "../types/DotRel";
import { DotTypeRel } from "../types/DotTypeRel";
import { pick } from "../lib/pick";

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
  | boolean;

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

export const formatDot = (dot: Dot, options?: NodeSelect): any => {
  if (isBoolean(options)) return options ? dot : undefined;

  return {
    ...(options?.preview && { preview: options.preview(dot) }),
    ...(options?.id && { id: dot.id }),
    ...(options?.types && { types: formatDotTypes(dot.types, options.types) }),
    ...(options?.data && {
      data: isBoolean(options.data)
        ? options.data
        : pick(dot.data, options.data),
    }),
    ...(options?.in && {
      in: dot.in.map<any>((rel) => formatRel(rel, options?.in)),
    }),
    ...(options?.out && {
      out: dot.out.map<any>((rel) => formatRel(rel, options?.out)),
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

  return nodes.map((node) => formatDot(node, options));
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
    ...(options?.from && { from: formatDot(rel.from, options?.from) }),
    ...(options?.to && { to: formatDot(rel.to, options?.to) }),
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
