import React from "react";
import {Layer} from "../../data/layer/layer";
import {Button} from "@mui/material";
import {FilterState} from "../../data/filterStore";
import {FilterSelector} from "./FilterSelector";
import {SectionTitle} from "../Atoms/SectionTitle";

interface Props {
  layers: Layer[];
  f: FilterState
}

export const Filters: React.FC<Props> = ({layers, f}) => {
  const handleAddFilter = () => {
    const l1 = layers.find(it => it.items.length !== 0);
    const l2 = layers.find(it => it !== l1 && it.items.length !== 0);
    if(!l1 || !l2) return;
    f.addFilter({
      type: "UseWith",
      l1: l1.layerId,
      i1: l1.items[0].itemId,
      l2: l2.layerId,
      i2: l2.items[0].itemId,
    });
  };
  return (
    <section>
      <SectionTitle>Filters</SectionTitle>
      {f.filters.map((it, i) =>
        <FilterSelector key={i} layers={layers} filter={it} remove={() => f.removeFilter(i)} updateFilter={(filter) => f.updateFilter(i, filter)} />)}
      <Button variant={"outlined"} onClick={handleAddFilter}>ADD FILTER</Button>
    </section>
  );
}