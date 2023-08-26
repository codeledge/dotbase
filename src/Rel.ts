import { Entity } from "./Entity";
import { Node } from "./Node";

export type ClientRel<R = any> = Pick<Rel<R>, "id" | "data">;

export class Rel<R = any> extends Entity {
  declare data: R;
  from: Node;
  to: Node;

  constructor(from: Node, to: Node, options: { data?: R } = {}) {
    super(options.data);
    this.from = from;
    this.to = to;
  }
}
