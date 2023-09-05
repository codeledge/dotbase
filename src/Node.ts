import { Rel } from "./Rel";
import { getId, getIdFromData } from "./_internals/getId";

export class Node<N = any> {
  id: number | string;
  data: N | undefined;
  out: Rel[] = [];
  in: Rel[] = [];

  constructor(data?: N) {
    this.id = getIdFromData(data) || getId();
    this.data = data;
  }
}
