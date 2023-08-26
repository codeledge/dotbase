import { Node } from "./Node";
import { Rel } from "./Rel";

export interface OutLink {
  to: Node;
  rel: Rel;
}

export interface InLink {
  from: Node;
  rel: Rel;
}
