import { getId } from "../_internals/getId";
import { Label } from "./Label";

export class LabelRel {
  id: number | string;
  verb: string | undefined;
  from: Label;
  to: Label;

  constructor(from: Label, to: Label, options: { verb?: string } = {}) {
    this.id = getId();
    this.from = from;
    this.to = to;
    this.verb = options.verb;
  }
}
