import { Node } from "./Node";
import { getId, getIdFromData } from "./_internals/getId";

export class Rel<R = any> {
  id: number | string;
  data?: R;
  from: Node;
  to: Node;

  constructor(from: Node, to: Node, options: { data?: R } = {}) {
    this.id = getIdFromData(options.data) || getId();
    this.from = from;
    this.to = to;
    this.data = options.data;
  }
}
