import { getId } from "../_internals/getId";
import { Rel } from "./Rel";
import { Label } from "./Label";

export type DotCreate<Data> = {
  id?: Dot["id"];
  data?: Data;
  labels?: string[]; // done from input
};

export type DotUpdate<Data> = {
  data?: Data;
  labels?: string[]; // done from input
};

export type DotClassCreate<Data> = {
  id?: Dot["id"];
  data?: Data;
  labels?: Label[];
};

export class Dot<Data = any> {
  id: number | string;
  x?: number;
  y?: number;
  // inConnectors: Record<
  //   string,
  //   {
  //     x: number;
  //     y: number;
  //   }
  // > = {};
  // outConnectors: Record<
  //   string,
  //   {
  //     x: number;
  //     y: number;
  //   }
  // > = {};
  data: Data | undefined;
  labels: Label[] = [];
  out: Rel[] = [];
  in: Rel[] = [];

  constructor(id?: Dot["id"], Labels?: Label[], data?: Data) {
    this.id = id || getId();
    this.data = data;
    this.labels = Labels || [];
  }
}

export const isDot = (dot: any): dot is Dot => {
  return dot instanceof Dot;
};
