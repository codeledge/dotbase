import { LabelRel } from "./LabelRel";

export class Label {
  name: string; // unique
  out: LabelRel[] = [];
  in: LabelRel[] = [];
  _asTaxon: Label[] = [];

  constructor(name: string) {
    this.name = name;
  }
}
