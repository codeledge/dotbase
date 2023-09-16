import { DotType } from "./types/DotType";
import { DotTypeRel } from "./types/DotTypeRel";
import { Dot, DotCreate, isDot } from "./types/Dot";
import { DotRel, DotRelCreate } from "./types/DotRel";
import { isArray, isFunction, isString } from "deverything";

export enum IteratorResult {
  CONTINUE,
  STOP,
}

export class GraphBase<DN = any, DR = any> {
  dotTypes = new Map<DotType["id"], DotType>();
  dotTypeRels = new Map<DotTypeRel["id"], DotTypeRel>();
  nodes = new Map<Dot["id"], Dot>();
  rels = new Map<DotRel["id"], DotRel>();

  getOrCreateDot<N = DN>(dotCreate: DotCreate<N> = {}) {
    if (dotCreate.id && this.nodes.has(dotCreate.id)) {
      return this.nodes.get(dotCreate.id) as Dot<N>;
    }
    const node = new Dot<N>(dotCreate);
    this.nodes.set(node.id, node);
    return node;
  }

  connectOrCreateTo<N = DN, R = DR>(
    currentDot: Dot<N>,
    dotRelCreate: DotRelCreate<R> = {},
    dotCreate: DotCreate<N> = {}
  ) {
    const toDot = this.getOrCreateDot<N>(dotCreate);

    const dotRel = this.connectDots(currentDot, toDot, dotRelCreate);

    return {
      toDot,
      dotRel,
    };
  }

  findDot<N = DN>({
    id,
    types,
    type,
  }: Partial<Dot> & { type?: string }): Dot<N> | undefined {
    const _types = types || [];
    if (type) _types.push(this.findDotType(type)!);
    return this.getNodes<N>().find((dot) => {
      return dot.id === id || dot.types.some((type) => _types?.includes(type));
    });
  }

  findDots<N = DN>({
    id,
    types,
    type,
  }: Partial<Dot> & { type?: string | DotType }): Dot<N>[] {
    const _types = types || [];
    if (type) _types.push(isString(type) ? this.findDotType(type)! : type);
    return this.getNodes<N>().filter((dot) => {
      return (
        (id ? dot.id === id : true) &&
        (_types.length ? dot.types.some((type) => _types.includes(type)) : true)
      );
    });
  }

  connectDots<F = DN, T = DN, R = DR>(
    from: Dot<F>,
    to: Dot<T>,
    {
      skipDuplicates,
      data,
      verb,
    }: { skipDuplicates?: boolean; data?: R; verb?: string } = {}
  ) {
    if (skipDuplicates && from.out.some((rel) => rel.to === to)) return;

    const dotRel = new DotRel(from, to, { verb, data });
    this.rels.set(dotRel.id, dotRel);
    from.out.push(dotRel);
    to.in.push(dotRel);

    return dotRel;
  }

  hasNode(id: Dot["id"]): boolean {
    return this.nodes.has(id);
  }

  deleteNode(id: Dot["id"]): boolean {
    return this.nodes.delete(id);
  }

  createDotType(name: string) {
    const dotType = new DotType(name);
    this.dotTypes.set(dotType.id, dotType);
    return dotType;
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

  getRel<R = DR>(id: DotRel<R>["id"]): DotRel<R> | undefined {
    return this.rels.get(id);
  }

  getRels(): DotRel[] {
    return Array.from(this.rels.values());
  }

  getNode<N = DN>(id: Dot["id"]): Dot<N> | undefined {
    return this.nodes.get(id);
  }

  getNodes<N = DN>(): Dot<N>[] {
    return Array.from<Dot<N>>(this.nodes.values());
  }

  getRoots<N = DN>() {
    return this.getNodes<N>().filter((node) => {
      return node.in.length === 0;
    });
  }

  getLeaves<N = DN>() {
    return this.getNodes<N>().filter((node) => {
      return node.out.length === 0;
    });
  }

  getNonLeaves<N = DN>() {
    return this.getNodes<N>().filter((node) => {
      return node.out.length !== 0;
    });
  }

  getPaths(
    startMatcher: Dot<DN> | Dot<DN>[] | ((n: Dot<DN>) => boolean),
    endMatcher?: Dot<DN> | Dot<DN>[] | ((n: Dot<DN>) => boolean),
    { maxDepth }: { maxDepth?: number } = {}
  ) {
    let paths: DotRel[][] = [];

    if (!startMatcher) return paths; // TODO: return all paths

    let _startDots: Dot<DN>[] = [];
    if (isDot(startMatcher)) _startDots = [startMatcher];
    else if (isArray(startMatcher)) _startDots = startMatcher;

    _startDots.forEach((startDot) => {
      this.walk(startDot, (currentNode, currentPath) => {
        if (currentNode === startMatcher) return;

        if (maxDepth && currentPath.length > maxDepth)
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
      });
    });

    return paths;
  }

  walk(
    node?: Dot,
    iterator?: (node: Dot, currentPath: DotRel[]) => IteratorResult | void,
    options?: {
      maxDepth?: number;
    }
  ) {
    let isWalkingStopped = false;
    let isCyclic = false;
    let deepestPath: DotRel[] = [];
    const visited = new Set<Dot["id"]>();

    const walkRecursive = (currentNode: Dot, currentPath: DotRel[]) => {
      // console.log("isWalkingStopped", isWalkingStopped);
      if (isWalkingStopped) return;

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
      if (currentPath.some((rel) => rel.from === currentNode)) {
        isCyclic = true;
        return;
      }

      currentNode.out.forEach((rel) => {
        walkRecursive(rel.to, currentPath.concat(rel));
      });
    };

    if (node) walkRecursive(node, []);
    else {
      this.nodes.forEach((node) => {
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
