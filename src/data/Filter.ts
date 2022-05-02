import {Layer, LayerId, LayerItemId} from "./layer/layer";
import {ItemIndexes} from "../logics/createImages/types";

export const FilterTypes = {
  Noop: 'Noop',
  UseWith: 'UseWith',
} as const;

export type UseWithFilter = {
  type: typeof FilterTypes.UseWith,
  l1: LayerId;
  i1: LayerItemId;
  l2: LayerId;
  i2: LayerItemId;
}

export type UseWithFilterCompiled = {
  type: typeof FilterTypes.UseWith,
  l1: number;
  i1: number;
  l2: number;
  i2: number;
}

export type NoopFilter = {
  type: typeof FilterTypes.Noop,
}

const noopFilter = {
  type: FilterTypes.Noop,
}
export type Filter = UseWithFilter | NoopFilter;
export type FilterCompiled = UseWithFilterCompiled | NoopFilter;

export const findLayerIndexById = (layers: Layer[], id: LayerId): number => layers.findIndex(it => it.layerId === id);
export const findLayerItemIndexById = (layers: Layer[], layerIndex: number, id: LayerItemId): number => layers[layerIndex].items.findIndex(it => it.itemId === id);

export const isUseWithFilterValid = (filter: UseWithFilter, layers: Layer[]): boolean => {
  const l1 = findLayerIndexById(layers, filter.l1);
  const l2 = findLayerIndexById(layers, filter.l2);
  if(l1 === -1 || l2 === -1 || l1 === l2) {
    return false;
  }
  if(!layers[l1].items.find(it => it.itemId === filter.i1) || !layers[l2].items.find(it => it.itemId === filter.i2)) return false;
  return true;
};

export const compileUseWithFilter = (filter: UseWithFilter, layers: Layer[]) => {
  const l1 = findLayerIndexById(layers, filter.l1);
  const l2 = findLayerIndexById(layers, filter.l2);
  if(l1 === -1 || l2 === -1 || l1 === l2) {
    return noopFilter;
  }
  return {
    type: FilterTypes.UseWith,
    l1: l1,
    i1: findLayerItemIndexById(layers, l1, filter.i1),
    l2: l2,
    i2: findLayerItemIndexById(layers, l2, filter.i2),
  }
}

const compileFilter = (filter: Filter, layers: Layer[]): FilterCompiled => {
  switch (filter.type) {
    case FilterTypes.UseWith: return compileUseWithFilter(filter, layers);
    case FilterTypes.Noop: return filter;
  }
}

export const compileFilters = (filters: Filter[], layers: Layer[]) => {
  return filters.map((f) => compileFilter(f, layers));
}

const runUseWithFilter = (item: ItemIndexes, filter: UseWithFilterCompiled): boolean => {
  return !(item[filter.l1] === filter.i1 && item[filter.l2] === filter.i2);
}

const runFilter = (item: ItemIndexes, filter: FilterCompiled): boolean => {
  switch (filter.type) {
    case FilterTypes.UseWith: {
      return runUseWithFilter(item, filter);
    }
    case FilterTypes.Noop: return true;
  }
}

const applyFilter = (indexed: ItemIndexes[], filter: FilterCompiled) => {
  switch (filter.type) {
    case FilterTypes.UseWith: {
      return indexed.filter(it => runUseWithFilter(it, filter));
    }
    case FilterTypes.Noop: return indexed;
  }
};


export const applyFilters = (indexes: ItemIndexes[], layers: Layer[], filters: FilterCompiled[]) => {
  return filters.reduce((prev, filter) => applyFilter(prev, filter), indexes);
};

export const isFiltered = (item: ItemIndexes, filters: FilterCompiled[]) => {
  for (let filter of filters) {
    if(!runFilter(item, filter)) return true;
  }
  return false;
}
