import { DotTypeRel } from "./DotTypeRel";
import { getId } from "../_internals/getId";

export class DotType {
  id: number | string;
  name: string | undefined;
  out: DotTypeRel[] = [];
  in: DotTypeRel[] = [];

  constructor(name: string) {
    this.id = getId();
    this.name = name;
  }
}
