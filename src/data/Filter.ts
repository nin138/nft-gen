import {Layer, LayerId, LayerItemId} from "./layer/layer";
import {ItemIndexes} from "../logics/combine/getAll";

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

const applyFilter = (indexed: ItemIndexes[], layers: Layer[], filter: FilterCompiled) => {
  switch (filter.type) {
    case FilterTypes.UseWith: {
      return indexed.filter(it => !(it[filter.l1] === filter.i1 && it[filter.l2] === filter.i2));
    }
    case FilterTypes.Noop: return indexed;
  }
};


export const applyFilters = (indexes: ItemIndexes[], layers: Layer[], _filters: Filter[]) => {
  const filters = _filters.map((f) => compileFilter(f, layers));
  return filters.reduce((prev, filter) => applyFilter(prev, layers, filter), indexes);
};
