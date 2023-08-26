export let currentId = 1;
export class Entity<D = any> {
  id: number | string;
  data?: D;

  constructor(data?: D) {
    // @ts-ignore
    const id = data?.["id"];
    this.id = id || currentId++;
    this.data = data;
  }
}
