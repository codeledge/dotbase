import { Label } from "./types/Label";
import { LabelRel } from "./types/LabelRel";
import { Dot, DotCreate, DotUpdate } from "./types/Dot";
import { Rel, RelCreate } from "./types/Rel";
import { isFunction, uniqueValues } from "deverything";

export class DotBase<DN = any, DR = any> {
  labelMap = new Map<Label["name"], Label>();
  labelRelMap = new Map<LabelRel["id"], LabelRel>();
  dotMap = new Map<Dot["id"], Dot>();
  relMap = new Map<Rel["id"], Rel>();
  title;

  constructor({ title }: { title?: string } = {}) {
    this.title = title;
  }

  // DOT
  createDot<N = DN>({ id, data, labels = [] }: DotCreate<N> = {}): Dot<N> {
    if (id && this.dotMap.has(id))
      throw new Error(`Dot with id ${id} already exists`);

    const Labels = this.mergeLabels(labels);

    const dot = new Dot<N>(id, Labels, data);
    this.dotMap.set(dot.id, dot);
    return dot;
  }

  getDot<N = DN>(id: Dot["id"]): Dot<N> {
    return this.dotMap.get(id)!;
  }

  updateDot<N = DN>(dotId: Dot["id"], dotUpdate: DotUpdate<N> = {}): Dot<N> {
    if (!this.hasDot(dotId)) {
      throw new Error(`Dot with id ${dotId} does not exist`);
    }

    const dot = this.getDot<N>(dotId);

    if (dotUpdate.data) dot.data = dotUpdate.data;
    if (dotUpdate.labels?.length)
      dot.labels = this.mergeLabels(dotUpdate.labels);

    return dot;
  }

  mergeDot<N = DN>(dotCreate: DotCreate<N> = {}): Dot<N> {
    if (dotCreate.id && this.hasDot(dotCreate.id)) {
      const existing = this.getDot<N>(dotCreate.id);
      const mergedData = {
        ...existing.data,
        ...dotCreate.data, // very primitive merge
      } as N;
      const mergedLabels = dotCreate.labels
        ? (uniqueValues(
            existing.labels.map(({ name }) => name).concat(dotCreate.labels)
          ) as string[])
        : undefined;
      // if (merged.types.length === 2) console.log("merged", merged.id);
      return this.updateDot<N>(existing.id, {
        data: mergedData,
        labels: mergedLabels,
      });
    }

    return this.createDot(dotCreate);
  }

  findDots<N = DN>(
    filter:
      | {
          data?: any; // TODO
          label?: string;
          labels?: string[];
          taxon?: string;
        }
      | ((d: Dot) => boolean)
  ): Dot<N>[] {
    if (isFunction(filter)) return this.getDots<N>().filter(filter);

    const _labels = filter.labels || [];
    if (filter.label) _labels.push(filter.label);
    if (filter.taxon) {
      const flatTaxonomy = this.getFlatTaxonomy(filter.taxon);
      if (flatTaxonomy) _labels.push(...flatTaxonomy);
    }
    return this.getDots<N>().filter((dot) => {
      return _labels.length
        ? dot.labels.some(({ name }) => _labels.includes(name))
        : true;
    });
  }

  getDots<N = DN>(): Dot<N>[] {
    return Array.from<Dot<N>>(this.dotMap.values());
  }

  hasDot(id: Dot["id"]): boolean {
    return this.dotMap.has(id);
  }

  deleteDot(id: Dot["id"]): boolean {
    this.getRels().forEach((rel) => {
      if (rel.from.id === id || rel.to.id === id) {
        this.relMap.delete(rel.id);
      }
    });
    return this.dotMap.delete(id);
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

  // LABEL
  createLabel(name: string): Label {
    const label = new Label(name);
    this.labelMap.set(label.name, label);
    return label;
  }

  mergeLabel(name: string): Label {
    return this.getLabel(name) || this.createLabel(name);
  }

  mergeLabels(labels: string[]) {
    return labels.map((name) => this.mergeLabel(name));
  }

  connectLabels(from: Label, to: Label, options: { verb?: string } = {}) {
    const rel = new LabelRel(from, to, options);
    this.labelRelMap.set(rel.id, rel);
    from.out.push(rel);
    to.in.push(rel);
  }

  getLabels(): Label[] {
    return Array.from(this.labelMap.values());
  }

  getLabel(name: string): Label | undefined {
    return this.labelMap.get(name);
  }

  getLabelRoots(): Label[] {
    return this.getLabels().filter((dotType) => {
      return dotType.in.length === 0;
    });
  }

  // TAXONOMY
  getFlatTaxonomy(label: string): Label["name"][] | undefined {
    return this.getLabel(label)?._asTaxon?.map(({ name }) => name);
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

    const dotRel = new Rel(from, to, { verb, data });
    this.relMap.set(dotRel.id, dotRel);
    from.out.push(dotRel);
    to.in.push(dotRel);

    return dotRel;
  }

  getRel<R = DR>(id: Rel<R>["id"]): Rel<R> | undefined {
    return this.relMap.get(id);
  }

  getRels(): Rel[] {
    return Array.from(this.relMap.values());
  }

  // LABEL RELS
  getLabelRels(): LabelRel[] {
    return Array.from(this.labelRelMap.values());
  }

  // PATTERN
  mergePattern<F = DN, R = DR, T = DN>(
    fromDotCreate: DotCreate<F>,
    dotRelCreate: RelCreate<R>,
    toDotCreate: DotCreate<T>
  ) {
    const fromDot = this.mergeDot<F>(fromDotCreate);
    const toDot = this.mergeDot<T>(toDotCreate);

    const dotRel = this.connectDots(fromDot, toDot, dotRelCreate);

    return {
      fromDot,
      dotRel,
      toDot,
    };
  }
}
