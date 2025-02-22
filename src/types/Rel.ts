import { getId } from "../_internals/getId";
import { Dot } from "./Dot";

export type RelCreate<Data> = {
  id?: number | string;
  data?: Data;
  verb?: string;
  skipDuplicates?: boolean;
};

export class Rel<RelData = any> {
  id: number | string;
  data?: RelData;
  verb?: string;
  from: Dot;
  to: Dot;

  constructor(from: Dot, to: Dot, { id, data, verb }: RelCreate<RelData> = {}) {
    this.id = id || getId();
    this.from = from;
    this.verb = verb;
    this.to = to;
    this.data = data;
  }
}
