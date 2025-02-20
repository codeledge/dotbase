import { isString } from "deverything";

export const getMmdId = (anyId: any) => {
  if (isString(anyId)) {
    return anyId.replace(/ /g, "_");
  }
  return anyId;
};
