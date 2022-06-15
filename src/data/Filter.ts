import {Layer, LayerId, LayerItemId} from "./layer/layer";
import {ItemIndexes} from "../logics/createImages/types";
import {
  Filter,
  FilterCompiled,
  FilterTypes,
  DoNotUseWithFilterCompiled, MustUseWithFilterCompiled, compileTwoLayerFilter, TwoLayerFilter
} from "../component/Filter/filterTypes";

export const findLayerIndexById = (layers: Layer[], id: LayerId): number => layers.findIndex(it => it.layerId === id);
export const findLayerItemIndexById = (layers: Layer[], layerIndex: number, id: LayerItemId): number => layers[layerIndex].items.findIndex(it => it.itemId === id);

export const isTwoLayerFilterValid = (filter: TwoLayerFilter, layers: Layer[]) => {
  const l1 = findLayerIndexById(layers, filter.l1);
  const l2 = findLayerIndexById(layers, filter.l2);
  if(l1 === -1 || l2 === -1 || l1 === l2) {
    return false;
  }
  return !(!layers[l1].items.find(it => it.itemId === filter.i1) || !layers[l2].items.find(it => it.itemId === filter.i2));

}

const compileFilter = (filter: Filter, layers: Layer[]): FilterCompiled => {
  switch (filter.type) {
    case FilterTypes.MustNotUseWith: return compileTwoLayerFilter(filter, layers);
    case FilterTypes.Noop: return filter;
    case FilterTypes.MustUseWith: return compileTwoLayerFilter(filter, layers);
  }
}

export const compileFilters = (filters: Filter[], layers: Layer[]) => {
  return filters.map((f) => compileFilter(f, layers));
}

const runMustNotUseWithFilter = (item: ItemIndexes, filter: DoNotUseWithFilterCompiled): boolean => {
  return !(item[filter.l1] === filter.i1 && item[filter.l2] === filter.i2);
}



const runMustUseWithFilter = (item: ItemIndexes, filter: MustUseWithFilterCompiled): boolean => {
  if(item[filter.l1] === filter.i1) {
    return item[filter.l2] === filter.i2;
  }
  return item[filter.l2] !== filter.i2;
};

const runFilter = (item: ItemIndexes, filter: FilterCompiled): boolean => {
  switch (filter.type) {
    case FilterTypes.MustNotUseWith: {
      return runMustNotUseWithFilter(item, filter);
    }
    case FilterTypes.Noop: return true;
    case FilterTypes.MustUseWith: return runMustUseWithFilter(item, filter);
  }
}

const applyFilter = (indexed: ItemIndexes[], filter: FilterCompiled): ItemIndexes[] => {
  switch (filter.type) {
    case FilterTypes.MustNotUseWith: {
      return indexed.filter(it => runMustNotUseWithFilter(it, filter));
    }
    case FilterTypes.Noop: return indexed;
    case FilterTypes.MustUseWith: {
      return indexed.filter(it => runMustUseWithFilter(it, filter));
    }
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
