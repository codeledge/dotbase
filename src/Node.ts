import { Entity } from "./Entity";
import { InLink, OutLink } from "./Link";

export type ClientNode = Pick<Node, "id" | "data">;

export class Node<N = any> extends Entity {
  declare data: N;
  out: OutLink[] = [];
  in: InLink[] = [];

  constructor(nodeData?: N) {
    super(nodeData);
  }
}
