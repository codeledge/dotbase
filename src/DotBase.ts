import { DotType } from "./types/DotType";
import { DotTypeRel } from "./types/DotTypeRel";
import { Dot, DotCreate, DotUpdate, isDot } from "./types/Dot";
import { DotRel, DotRelCreate } from "./types/DotRel";
import { isArray, isFunction, isString, uniqueValues } from "deverything";

export enum IteratorResult {
  CONTINUE,
  STOP,
}

export class DotBase<DN = any, DR = any> {
  dotTypes = new Map<DotType["name"], DotType>();
  dotTypeRels = new Map<DotTypeRel["id"], DotTypeRel>();
  dots = new Map<Dot["id"], Dot>();
  rels = new Map<DotRel["id"], DotRel>();
  title;

  constructor({ title }: { title?: string } = {}) {
    this.title = title;
  }

  // DOT
  createDot<N = DN>({ id, data, typeNames = [] }: DotCreate<N> = {}): Dot<N> {
    if (id && this.dots.has(id))
      throw new Error(`Dot with id ${id} already exists`);

    const types = this.getOrCreateDotTypes(typeNames);

    const node = new Dot<N>({
      id,
      data,
      types,
    });
    this.dots.set(node.id, node);
    return node;
  }

  getDot<N = DN>({ id }: { id: Dot["id"] }): Dot<N> {
    return this.dots.get(id)!;
  }

  getOrCreateDot<N = DN>(dotCreate: DotCreate<N> = {}) {
    if (dotCreate.id && this.dots.has(dotCreate.id)) {
      return this.getDot<N>({ id: dotCreate.id });
    }
    return this.createDot<N>(dotCreate);
  }

  updateDot<N = DN>(dotId: Dot["id"], dotUpdate: DotUpdate<N> = {}): Dot<N> {
    if (!this.hasDot(dotId)) {
      throw new Error(`Dot with id ${dotId} does not exist`);
    }

    const dot = this.getDot<N>({ id: dotId });

    if (dotUpdate.data) dot.data = dotUpdate.data;
    if (dotUpdate.typeNames?.length)
      dot.types = this.getOrCreateDotTypes(dotUpdate.typeNames);

    return dot;
  }

  mergeDot<N = DN>(dotCreate: DotCreate<N> = {}): Dot<N> {
    if (dotCreate.id && this.hasDot(dotCreate.id)) {
      const existing = this.getDot<N>({ id: dotCreate.id });
      const mergedData = {
        ...existing.data,
        ...dotCreate.data, // very primitive merge
      } as N;
      const mergedTypeNames = dotCreate.typeNames
        ? uniqueValues(
            existing.types.map(({ name }) => name).concat(dotCreate.typeNames)
          )
        : undefined;
      // if (merged.types.length === 2) console.log("merged", merged.id);
      return this.updateDot<N>(existing.id, {
        data: mergedData,
        typeNames: mergedTypeNames,
      });
    }

    return this.createDot(dotCreate);
  }

  findDot<N = DN>({
    id,
    types,
    type,
  }: Partial<Dot> & { type?: string }): Dot<N> | undefined {
    const _types = types || [];
    if (type) _types.push(this.findDotType(type)!);
    return this.getDots<N>().find((dot) => {
      return dot.id === id || dot.types.some((type) => _types?.includes(type));
    });
  }

  findDots<N = DN>(
    filter: (Partial<Dot> & { type?: string | DotType }) | ((d: Dot) => boolean)
  ): Dot<N>[] {
    if (isFunction(filter)) return this.getDots<N>().filter(filter);

    const _types = filter.types || [];
    if (filter.type)
      _types.push(
        isString(filter.type) ? this.findDotType(filter.type)! : filter.type
      );
    return this.getDots<N>().filter((dot) => {
      return (
        (filter.id ? dot.id === filter.id : true) &&
        (_types.length ? dot.types.some((type) => _types.includes(type)) : true)
      );
    });
  }

  getDots<N = DN>(): Dot<N>[] {
    return Array.from<Dot<N>>(this.dots.values());
  }

  hasDot(id: Dot["id"]): boolean {
    return this.dots.has(id);
  }

  deleteDot(id: Dot["id"]): boolean {
    return this.dots.delete(id);
  }

  getRoots<N = DN>() {
    return this.getDots<N>().filter((node) => {
      return node.in.length === 0;
    });
  }

  getLeaves<N = DN>() {
    return this.getDots<N>().filter((node) => {
      return node.out.length === 0;
    });
  }

  getNonLeaves<N = DN>() {
    return this.getDots<N>().filter((node) => {
      return node.out.length !== 0;
    });
  }

  // DOT TYPE
  createDotType(name: string): DotType {
    const dotType = new DotType(name);
    this.dotTypes.set(dotType.name, dotType);
    return dotType;
  }

  getOrCreateDotType(name: string): DotType {
    if (this.dotTypes.has(name)) return this.dotTypes.get(name)!;
    else return this.createDotType(name);
  }

  getOrCreateDotTypes(names: string[]) {
    return names.map((name) => this.getOrCreateDotType(name));
  }

  connectDotTypes(from: DotType, to: DotType, options: { verb?: string } = {}) {
    const rel = new DotTypeRel(from, to, options);
    this.dotTypeRels.set(rel.id, rel);
    from.out.push(rel);
    to.in.push(rel);
  }

  getDotTypes(): DotType[] {
    return Array.from(this.dotTypes.values());
  }

  findDotType(name: string): DotType | undefined {
    return this.getDotTypes().find((dotType) => {
      return dotType.name === name;
    });
  }

  getDotTypeRoots(): DotType[] {
    return this.getDotTypes().filter((dotType) => {
      return dotType.in.length === 0;
    });
  }

  // REL
  connectDots<F = DN, T = DN, R = DR>(
    from: Dot<F>,
    to: Dot<T>,
    {
      skipDuplicates,
      data,
      verb,
    }: { skipDuplicates?: boolean; data?: R; verb?: string } = {}
  ) {
    if (
      skipDuplicates &&
      from.out.some((rel) => {
        return rel.to === to && rel.verb === verb;
        // TODO: skip also on data
      })
    )
      return;

    // add inverse? is it useful at all?

    const dotRel = new DotRel(from, to, { verb, data });
    this.rels.set(dotRel.id, dotRel);
    from.out.push(dotRel);
    to.in.push(dotRel);

    return dotRel;
  }

  getRel<R = DR>(id: DotRel<R>["id"]): DotRel<R> | undefined {
    return this.rels.get(id);
  }

  getRels(): DotRel[] {
    return Array.from(this.rels.values());
  }

  // DOT TYPE RELS
  getDotTypeRels(): DotTypeRel[] {
    return Array.from(this.dotTypeRels.values());
  }

  // PATTERN
  mergePattern<F = DN, R = DR, T = DN>(
    fromDotCreate: Dot<F> | DotCreate<F>,
    dotRelCreate: DotRelCreate<R>,
    toDotCreate: Dot<T> | DotCreate<T>
  ) {
    const fromDot = this.getOrCreateDot<F>(fromDotCreate);
    const toDot = this.getOrCreateDot<T>(toDotCreate);

    const dotRel = this.connectDots(fromDot, toDot, dotRelCreate);

    return {
      fromDot,
      dotRel,
      toDot,
    };
  }

  // PATH
  getPaths(
    startMatcher: Dot<DN> | Dot<DN>[],
    pathFilter?: (rel: DotRel[]) => boolean,
    endMatcher?: Dot<DN> | Dot<DN>[] | ((n: Dot<DN>) => boolean),
    {
      maxDepth,
      direction,
    }: { maxDepth?: number; direction?: "out" | "in" } = {}
  ) {
    let paths: DotRel[][] = [];

    if (!startMatcher) return paths; // TODO: return all paths

    let _startDots: Dot<DN>[] = [];
    if (isDot(startMatcher)) _startDots = [startMatcher];
    else if (isArray(startMatcher)) _startDots = startMatcher;

    _startDots.forEach((startDot) => {
      this.walk(
        startDot,
        (currentNode, currentPath) => {
          if (currentNode === startDot) return;

          if (pathFilter && !pathFilter(currentPath))
            return IteratorResult.CONTINUE;

          if (isDot(endMatcher) && currentNode === endMatcher) {
            // console.log("currentNode", currentNode);
            paths.push(currentPath);
            return IteratorResult.CONTINUE;
          } else if (
            isArray(endMatcher) &&
            endMatcher.some((n) => n === currentNode)
          ) {
            paths.push(currentPath);
            return IteratorResult.CONTINUE;
          } else if (isFunction(endMatcher) && endMatcher(currentNode)) {
            paths.push(currentPath);
            return IteratorResult.CONTINUE;
          }
        },
        { maxDepth, direction }
      );
    });

    return paths;
  }

  walk(
    fromDot?: Dot,
    iterator?: (
      currentDot: Dot,
      currentPath: DotRel[]
    ) => IteratorResult | void,
    options?: {
      maxDepth?: number;
      direction?: "out" | "in";
    }
  ) {
    let isWalkingStopped = false;
    let isCyclic = false;
    let deepestPath: DotRel[] = [];
    const visited = new Set<Dot["id"]>();

    const walkRecursive = (currentNode: Dot, currentPath: DotRel[]) => {
      // console.log("isWalkingStopped", isWalkingStopped);
      if (isWalkingStopped) return;

      if (options?.maxDepth && currentPath.length > options?.maxDepth) return;

      visited.add(currentNode.id);

      if (currentPath.length > deepestPath.length) {
        deepestPath = currentPath;
      }

      const result = iterator?.(currentNode, currentPath);

      if (result === IteratorResult.STOP) {
        isWalkingStopped = true;
        return;
      }

      if (result === IteratorResult.CONTINUE) {
        return;
      }

      if (options?.maxDepth && currentPath.length > options?.maxDepth) return;
      if (
        currentPath.some((rel) =>
          options?.direction === "in"
            ? rel.to === currentNode
            : rel.from === currentNode
        )
      ) {
        isCyclic = true;
        return;
      }

      if (options?.direction === "in") {
        currentNode.in.forEach((rel) => {
          walkRecursive(rel.from, currentPath.concat(rel));
        });
      } else {
        currentNode.out.forEach((rel) => {
          walkRecursive(rel.to, currentPath.concat(rel));
        });
      }
    };

    if (fromDot) walkRecursive(fromDot, []);
    else {
      this.dots.forEach((node) => {
        if (!visited.has(node.id)) {
          walkRecursive(node, []);
        }
      });
    }

    return {
      isCyclic,
      deepestPath,
      isWalkingStopped,
    };
  }
}
