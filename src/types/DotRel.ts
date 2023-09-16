import { getId } from "../_internals/getId";
import { Dot } from "./Dot";

export type DotRelCreate<Data> = {
  id?: number | string;
  data?: Data;
  verb?: string;
  skipDuplicates?: boolean;
};

export class DotRel<DotRelData = any> {
  id: number | string;
  data?: DotRelData;
  verb?: string;
  from: Dot;
  to: Dot;

  constructor(
    from: Dot,
    to: Dot,
    { id, data, verb }: DotRelCreate<DotRelData> = {}
  ) {
    this.id = id || getId();
    this.from = from;
    this.verb = verb;
    this.to = to;
    this.data = data;
  }
}
