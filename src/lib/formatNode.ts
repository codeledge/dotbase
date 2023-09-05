import { isBoolean } from "deverything";
import { Node } from "../Node";
import { Rel } from "../Rel";

export type FormatNodeOptions = Partial<Record<keyof Node, boolean>>;

export type NodeSelect =
  | Partial<{
      id: boolean;
      data: boolean;
      in: boolean | RelSelect;
      out: boolean | RelSelect;
    }>
  | boolean;

export type RelSelect =
  | Partial<{
      id: boolean;
      data: boolean;
      from: boolean | NodeSelect;
      to: boolean | NodeSelect;
    }>
  | boolean;

export type LinkSelect = Partial<{
  from: NodeSelect;
  to: NodeSelect;
  rel: RelSelect;
}>;

export const formatNode = (node: Node, options?: NodeSelect): any => {
  if (isBoolean(options)) return options ? node : undefined;
  return {
    ...(options?.id && { id: node.id }),
    ...(options?.data && { data: node.data }),
    ...(options?.in && {
      in: node.in.map<any>((rel) => formatRel(rel, options?.in)),
    }),
    ...(options?.out && { out: node.out.map((rel) => rel.to.id) }),
  };
};

export const formatRel = (rel: Rel, options?: RelSelect): any => {
  if (isBoolean(options)) return options ? rel : undefined;

  return {
    ...(options?.id && { id: rel.id }),
    ...(options?.data && { data: rel.data }),
    ...(options?.from && { from: formatNode(rel.from, options?.from) }),
    ...(options?.to && { to: formatNode(rel.to, options?.to) }),
  };
};
