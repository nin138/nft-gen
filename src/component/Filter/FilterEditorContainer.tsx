import React from "react";
import {Button, Paper, styled} from "@mui/material";
import {DeleteIcon} from "../Icons";
import {Filter, FilterTypes} from "./filterTypes";
import {FilterTypeSelector} from "./FilterTypeSelector";
import {Layer} from "../../data/layer/layer";

const Container = styled(Paper)({
  display: 'flex',
  padding: 12,
  margin: '24px 0',
  justifyContent: "space-between",
});

const DelButton = styled(Button)({
  width: 50,
  height: 65,
  border: "solid",
  borderRadius: '50%',
  justifySelf: 'flex-end',
})

type Props = {
  filter: Filter
  remove: () => void;
  isValid: boolean;
  updateFilter: (filter: Filter) => void;
  children: React.ReactNode;
  layers: Layer[]
}

const updateFilterType = (filter: Filter, type: keyof typeof FilterTypes, layers: Layer[]): Filter | undefined => {
  const l1 = layers.find(it => it.items.length !== 0);
  const l2 = layers.find(it => it !== l1 && it.items.length !== 0);
  if(!l1 || !l2) return;
  if(filter.type === FilterTypes.MustUseWithList) {
    return {
      type: type,
       l1: l1.layerId,
       i1: l1.items[0].itemId,
       l2: l2.layerId,
       i2: l2.items[0].itemId,
    } as Filter;
  }
  if(type === FilterTypes.MustUseWithList) {
    return {
      type,
      left: l1.layerId,
      leftItem: l1.items[0].itemId,
      right: l2.layerId,
      items: [
        l2.items[0].itemId
      ],
    }
  }
  return {
    ...filter,
    type: type,
  } as Filter
}

export const FilterEditorContainer: React.FC<Props> = ({filter, remove, updateFilter, isValid, layers,  children}) => {
  return (
    <Container elevation={4} style={{background: isValid ? undefined : '#a00'}}>
      <div style={{width: '100%'}}>
        <FilterTypeSelector onChange={(v) => {
          const next = updateFilterType(filter, v as keyof typeof FilterTypes, layers);
          if(next) updateFilter(next);
        }} value={filter.type} />
        { isValid ? '' : '(INVALID)' }
        {children}
      </div>
      <DelButton variant={"outlined"} onClick={remove}><DeleteIcon/></DelButton>
    </Container>
  );
}
