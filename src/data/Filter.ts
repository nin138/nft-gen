import {Layer, LayerId, LayerItemId} from "./layer/layer";
import {ItemIndexes} from "../logics/combine/getAll";

export const FilterTypes = {
  UseWith: 'UseWith',
} as const;

export type UseWithFilter = {
  type: typeof FilterTypes.UseWith,
  l1: LayerId;
  i1: LayerItemId;
  l2: LayerId;
  i2: LayerItemId;
}

type UseWithFilterCompiled = {
  type: typeof FilterTypes.UseWith,
  l1: number;
  i1: number;
  l2: number;
  i2: number;
}


export type Filter = UseWithFilter;
export type FilterCompiled = UseWithFilterCompiled;

const findLayerIndexById = (layers: Layer[], id: LayerId): number => layers.findIndex(it => it.layerId === id);
const findLayerItemIndexById = (layers: Layer[], layerIndex: number, id: LayerItemId): number => layers[layerIndex].items.findIndex(it => it.itemId === id);

const compileFilter = (filter: Filter, layers: Layer[]): FilterCompiled => {
  switch (filter.type) {
    case FilterTypes.UseWith: {
      const fli = findLayerIndexById(layers, filter.l1);
      const tli = findLayerIndexById(layers, filter.l2);
      return {
        type: FilterTypes.UseWith,
        l1: fli,
        i1: findLayerItemIndexById(layers, fli, filter.i1),
        l2: tli,
        i2: findLayerItemIndexById(layers, tli, filter.i2),
      }
    }
  }
}

const applyFilter = (indexed: ItemIndexes[], layers: Layer[], filter: FilterCompiled) => {
  switch (filter.type) {
    case FilterTypes.UseWith: {
      return indexed.filter(it => !(it[filter.l1] === filter.i1 && it[filter.l2] === filter.i2))
    }
  }
};


export const applyFilters = (indexes: ItemIndexes[], layers: Layer[], _filters: Filter[]) => {
  const filters = _filters.map((f) => compileFilter(f, layers));
  return filters.reduce((prev, filter) => applyFilter(indexes, layers, filter), indexes);
};
