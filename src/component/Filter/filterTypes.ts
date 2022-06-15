import {Layer, LayerId, LayerItemId} from "../../data/layer/layer";
import {findLayerIndexById, findLayerItemIndexById} from "../../data/Filter";

export const FilterTypes = {
  Noop: 'Noop',
  MustNotUseWith: 'MustNotUseWith',
  MustUseWith: 'MustUseWith',
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

export type DoNotUseWithFilter = {
  type: typeof FilterTypes.MustNotUseWith,
} & TwoLayerFilter;

export type DoNotUseWithFilterCompiled = {
  type: typeof FilterTypes.MustNotUseWith,
} & TwoLayerFilterCompiled;

export type MustUseWithFilter = {
  type: typeof FilterTypes.MustUseWith,
} & TwoLayerFilter;

export type MustUseWithFilterCompiled = {
  type: typeof FilterTypes.MustUseWith,
} & TwoLayerFilterCompiled;

export type NoopFilter = {
  type: typeof FilterTypes.Noop,
}

export type Filter = DoNotUseWithFilter | NoopFilter | MustUseWithFilter;
export type FilterCompiled = DoNotUseWithFilterCompiled | NoopFilter | MustUseWithFilterCompiled;

const noopFilter: NoopFilter = {
  type: FilterTypes.Noop,
}


export const compileTwoLayerFilter =
  <T extends TwoLayerFilter & { type: keyof typeof FilterTypes }>(filter: T, layers: Layer[]): FilterCompiled=> {
  const l1 = findLayerIndexById(layers, filter.l1);
  const l2 = findLayerIndexById(layers, filter.l2);
  if(l1 === -1 || l2 === -1 || l1 === l2) {
    return noopFilter;
  }
  return {
    ...filter,
    l1: l1,
    i1: findLayerItemIndexById(layers, l1, filter.i1),
    l2: l2,
    i2: findLayerItemIndexById(layers, l2, filter.i2),
  }
}
