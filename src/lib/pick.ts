import { PlainObject } from "deverything";

export const pick = <T extends PlainObject>(
  obj: T,
  keys: Record<keyof T, true>
) => {
  return Object.keys(keys).reduce((acc: Partial<T>, key: keyof T) => {
    if (key in obj) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};
