import { isKey, isNumber, isObject, isString } from "deverything";

let currentId = 1;
export function getId() {
  return currentId++;
}
