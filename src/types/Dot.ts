import { getId } from "../_internals/getId";
import { DotRel } from "./DotRel";
import { DotType } from "./DotType";

export type DotCreate<Data> = {
  id?: Dot["id"];
  data?: Data;
  typeNames?: string[];
};

export type DotUpdate<Data> = {
  data?: Data;
  typeNames?: string[];
};

export class Dot<Data = any> {
  id: number | string;
  data: Data | undefined;
  types: DotType[] = [];
  out: DotRel[] = [];
  in: DotRel[] = [];

  constructor({ id, data, types = [] }: Partial<Dot<Data>> = {}) {
    this.id = id || getId();
    this.data = data;
    this.types = types;
  }
}

export const isDot = (dot: any): dot is Dot => {
  return dot instanceof Dot;
};
