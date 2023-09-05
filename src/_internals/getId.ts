import { isKey, isNumber, isObject, isString } from "deverything";

let currentId = 1;
export function getId() {
  return currentId++;
}

export const getIdFromData = (data: any) => {
  if (isObject(data) && isKey("id", data)) {
    const id = data?.["id"];
    if (isNumber(id) || isString(id)) {
      return id;
    }
  }
  return getId();
};
