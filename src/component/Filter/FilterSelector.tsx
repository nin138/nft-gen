import {Layer} from "../../data/layer/layer";
import {Filter, FilterTypes, UseWithFilter} from "../../data/Filter";
import React from "react";
import {UseWithFilterEditor} from "./UseWithFilterEditor";

export type FilterProps = {
  layers: Layer[]
  filter: Filter
  remove: () => void;
  updateFilter: (filter: Filter) => void;
}

export const FilterSelector: React.FC<FilterProps> = ({layers, filter, remove, updateFilter}) => {
  switch (filter.type) {
    case FilterTypes.Noop: return null;
    case FilterTypes.UseWith: return <UseWithFilterEditor layers={layers} filter={filter} remove={remove} updateFilter={updateFilter} />
  }
}
