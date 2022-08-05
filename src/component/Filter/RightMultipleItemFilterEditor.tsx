import React from "react";
import {Layer, LayerId, LayerItem, LayerItemId} from "../../data/layer/layer";
import {
  findLayerIndexById,
} from "../../data/Filter";
import {Button, Paper, styled} from "@mui/material";
import {Select} from "../Atoms/Select";
import {Filter, MustUseWithListFilter} from "./filterTypes";
import {FilterEditorContainer} from "./FilterEditorContainer";
import {scrollbarStyle} from "../Atoms/scrollbarStyle";

const Items = styled('div')({
  display: "flex",
  alignItems: 'center',
});

const Item = styled(Paper)({
  display: 'flex',
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: 12,
  margin: 8,
});

const Img = styled('img')({
  width: 180,
});

const ItemContainer = styled(Paper)({
  userSelect: "none",
  display: "flex",
  // margin: '8px auto 0',
  padding: '8px 24px',
  overflowX: 'scroll',
  ...scrollbarStyle,
});

type Props = {
  layers: Layer[]
  filter: MustUseWithListFilter
  remove: () => void;
  updateFilter: (filter: Filter) => void;
}

const findLayer = (layers: Layer[], layerId: LayerId) => layers.find(it => it.layerId === layerId);

export const isFilterValid = (filter: MustUseWithListFilter, layers: Layer[]) => {
  const l1 = findLayerIndexById(layers, filter.left);
  const l2 = findLayerIndexById(layers, filter.right);
  if(l1 === -1 || l2 === -1 || l1 === l2) {
    return false;
  }
  return !(!layers[l1].items.find(it => it.itemId === filter.leftItem)
    || filter.items.every(item => !layers[l2].items.find(it => it.itemId === item)));
}

export const RightMultipleItemFilterEditor: React.FC<Props> = ({layers, filter, remove, updateFilter}) => {
  const l1 = layers.find(it => it.layerId === filter.left);
  const i1 = l1?.items.find(it => it.itemId === filter.leftItem);

  const l2 = layers.find(it => it.layerId === filter.right);

  const items = filter.items.map(it => l2?.items.find(ll => it === ll.itemId)!).filter(it => it !== undefined);

  const layerSelectItems = layers.filter(it => it.items.length !== 0).map(it => ({label: it.name, value: it.layerId}));
  const isValid = isFilterValid(filter, layers);
  const rightItem = (item: LayerItem, index: number) => {
    return (
      <Item key={index}>
        <Img src={item?.image.dataUrl} />
        {
          index === 0 && <Select value={l2?.layerId || ''} onChange={(v) => updateFilter({
          ...filter,
          right: v as LayerId,
          items: [],
        })}>
          {layerSelectItems}
        </Select>
        }
        <Select value={item?.itemId || ''} onChange={(v) =>
          updateFilter({
            ...filter,
            items: filter.items.map((it, i) => i !== index ? it : v as LayerItemId)
          })}>
          {l2?.items.map(it => ({label: it.name, value: it.itemId})) || []}
        </Select>
      </Item>
    );
  };

  return (
    <FilterEditorContainer filter={filter} remove={remove} isValid={isValid} updateFilter={updateFilter} layers={layers}>
      <Items>
        <Item>
          <Img src={i1?.image.dataUrl} />
          <Select value={l1?.layerId || ''} onChange={(v) => updateFilter({
            ...filter,
            left: v as LayerId,
            leftItem: findLayer(layers, v as LayerId)!.items[0].itemId
          })}>
            {layerSelectItems}
          </Select>
          <Select value={i1?.itemId || ''} onChange={(v) => updateFilter({...filter, leftItem: v as LayerItemId})}>
            {l1?.items.map(it => ({label: it.name, value: it.itemId})) || []}
          </Select>
        </Item>
        <div>AND(</div>
        <ItemContainer>
          {items.map((it, i) => rightItem(it, i))}
          <Button onClick={() => updateFilter({...filter, items: [...filter.items, filter.items[0]] as any})}>add item</Button>
        </ItemContainer>
        )
      </Items>
    </FilterEditorContainer>
  );
}
