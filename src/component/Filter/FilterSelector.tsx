import {Layer} from "../../data/layer/layer";
import React from "react";
import {Filter, FilterTypes} from "./filterTypes";
import {TwoLayerFilterEditor} from "./TwoLayerFilterEditor";
import {RightMultipleItemFilterEditor} from "./RightMultipleItemFilterEditor";

export type FilterProps = {
  layers: Layer[]
  filter: Filter
  remove: () => void;
  updateFilter: (filter: Filter) => void;
}

export const FilterSelector: React.FC<FilterProps> = ({layers, filter, remove, updateFilter}) => {
  switch (filter.type) {
    case FilterTypes.Noop: return null;
    case FilterTypes.MustNotUseWith: return <TwoLayerFilterEditor layers={layers} filter={filter} remove={remove} updateFilter={updateFilter} />
    case FilterTypes.MustUseWith: return <TwoLayerFilterEditor layers={layers} filter={filter} remove={remove} updateFilter={updateFilter} />
    case FilterTypes.MustUseWithList:
      return <RightMultipleItemFilterEditor layers={layers} filter={filter} remove={remove} updateFilter={updateFilter} />
  }
}
