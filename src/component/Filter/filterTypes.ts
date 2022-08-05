import {Layer, LayerId, LayerItemId} from "../../data/layer/layer";
import {findLayerIndexById, findLayerItemIndexById} from "../../data/Filter";

export const FilterTypes = {
  Noop: 'Noop',
  MustNotUseWith: 'MustNotUseWith',
  MustUseWith: 'MustUseWith',
  MustUseWithList: 'MustUseWithList',
} as const;

export type TwoLayerFilter = {
  type: keyof typeof FilterTypes;
  l1: LayerId;
  i1: LayerItemId;
  l2: LayerId;
  i2: LayerItemId;
}

type TwoLayerFilterCompiled = {
  l1: number;
  i1: number;
  l2: number;
  i2: number;
}

export type MustUseWithFilter = {
  type: typeof FilterTypes.MustUseWith,
} & TwoLayerFilter;

export type MustUseWithFilterCompiled = {
  type: typeof FilterTypes.MustUseWith,
} & TwoLayerFilterCompiled;


export type MustUseWithListFilter = {
  type: typeof FilterTypes.MustUseWithList,
  left: LayerId;
  leftItem: LayerItemId;
  right: LayerId;
  items: LayerItemId[]
};

export type MustUseWithListFilterCompiled = {
  type: typeof FilterTypes.MustUseWithList,
  left: number;
  leftItem: number;
  right: number;
  items: number[]
};

export type MustNotUseWithFilter = {
  type: typeof FilterTypes.MustNotUseWith,
} & TwoLayerFilter;

export type MustNotUseWithFilterCompiled = {
  type: typeof FilterTypes.MustNotUseWith,
} & TwoLayerFilterCompiled;

export type NoopFilter = {
  type: typeof FilterTypes.Noop,
}

export type TwoLayerFilters = MustNotUseWithFilter | MustUseWithFilter;
export type Filter = TwoLayerFilters | NoopFilter | MustUseWithListFilter;

export type FilterCompiled =  NoopFilter | MustUseWithListFilterCompiled | MustNotUseWithFilterCompiled | MustUseWithFilterCompiled;

const noopFilter: NoopFilter = {
  type: FilterTypes.Noop,
}

export const compileMustUseWithListFilter = (filter: MustUseWithListFilter, layers: Layer[]): MustUseWithListFilterCompiled|NoopFilter => {
  const l = findLayerIndexById(layers, filter.left);
  const r = findLayerIndexById(layers, filter.right);
  if(l === -1 || r === -1 || l === r || filter.items.length === 0) {
    return noopFilter;
  }
  return {
    type: filter.type,
    left: l,
    leftItem: findLayerItemIndexById(layers, l, filter.leftItem),
    right: r,
    items: filter.items.map(it => findLayerItemIndexById(layers, r, it)),
  }
}

export const compileTwoLayerFilter =
  <T extends TwoLayerFilter & { type: keyof typeof FilterTypes }>(filter: T, layers: Layer[])
    : FilterCompiled=> {
  const l1 = findLayerIndexById(layers, filter.l1);
  const l2 = findLayerIndexById(layers, filter.l2);
  if(l1 === -1 || l2 === -1 || l1 === l2) {
    return noopFilter;
  }
  const r: TwoLayerFilterCompiled = {
    ...filter,
    l1: l1,
    i1: findLayerItemIndexById(layers, l1, filter.i1),
    l2: l2,
    i2: findLayerItemIndexById(layers, l2, filter.i2),
  }
  return r as unknown as FilterCompiled;
}
