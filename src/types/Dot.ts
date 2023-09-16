import { getId } from "../_internals/getId";
import { DotRel } from "./DotRel";
import { DotType } from "./DotType";

export type DotCreate<Data> = {
  id?: number | string;
  data?: Data;
  types?: DotType[];
};

export type DotUpdate<Data> = {
  data?: Data;
  types?: DotType[];
};

export class Dot<Data = any> {
  id: number | string;
  data: Data | undefined;
  types: DotType[] = [];
  out: DotRel[] = [];
  in: DotRel[] = [];

  constructor({ id, data, types = [] }: DotCreate<Data> = {}) {
    this.id = id || getId();
    this.data = data;
    this.types = types;
  }
}

export const isDot = (dot: any): dot is Dot => {
  return dot instanceof Dot;
};
