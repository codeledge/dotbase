import { DotTypeRel } from "./DotTypeRel";

export class DotType {
  name: string; // unique
  out: DotTypeRel[] = [];
  in: DotTypeRel[] = [];

  constructor(name: string) {
    this.name = name;
  }
}
