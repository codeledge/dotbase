import { getId } from "../_internals/getId";
import { DotType } from "./DotType";

export class DotTypeRel {
  id: number | string;
  verb: string | undefined;
  from: DotType;
  to: DotType;

  constructor(from: DotType, to: DotType, options: { verb?: string } = {}) {
    this.id = getId();
    this.from = from;
    this.to = to;
    this.verb = options.verb;
  }
}
