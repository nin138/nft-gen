import React from "react";
import {Layer, LayerId, LayerItemId} from "../../data/layer/layer";
import {
  Filter, isUseWithFilterValid,
  UseWithFilter,
} from "../../data/Filter";
import {Button, Paper, styled} from "@mui/material";
import {Select} from "../Atoms/Select";
import {DeleteIcon} from "../Icons";

const Container = styled(Paper)({
  display: 'flex',
  padding: 12,
  margin: '24px 0',
  justifyContent: "space-between",
});

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

const DelButton = styled(Button)({
  width: 50,
  height: 65,
  border: "solid",
  borderRadius: '50%',
  justifySelf: 'flex-end',
})

type Props = {
  layers: Layer[]
  filter: UseWithFilter
  remove: () => void;
  updateFilter: (filter: Filter) => void;
}

const findLayer = (layers: Layer[], layerId: LayerId) => layers.find(it => it.layerId === layerId);

export const UseWithFilterEditor: React.FC<Props> = ({layers, filter, remove, updateFilter}) => {

  const l1 = layers.find(it => it.layerId === filter.l1);
  const i1 = l1?.items.find(it => it.itemId === filter.i1);

  const l2 = layers.find(it => it.layerId === filter.l2);
  const i2 = l2?.items.find(it => it.itemId === filter.i2);

  const layerSelectItems = layers.filter(it => it.items.length !== 0).map(it => ({label: it.name, value: it.layerId}));
  const isValid = isUseWithFilterValid(filter, layers);
  return (
    <Container elevation={4} style={{background: isValid ? undefined : '#a00'}}>
      <div>
      NAND FILTER { isValid ? '' : '(INVALID)' }
      <Items>
        <Item>
          <Img src={i1?.image.dataUrl} />
          <Select value={l1?.layerId || ''} onChange={(v) => updateFilter({
            ...filter,
            l1: v as LayerId,
            i1: findLayer(layers, v as LayerId)!.items[0].itemId
          })}>
            {layerSelectItems}
          </Select>
          <Select value={i1?.itemId || ''} onChange={(v) => updateFilter({...filter, i1: v as LayerItemId})}>
            {l1?.items.map(it => ({label: it.name, value: it.itemId})) || []}
          </Select>
        </Item>
        <div>AND</div>
        <Item>
          <Img src={i2?.image.dataUrl}/>
          <Select value={l2?.layerId || ''} onChange={(v) => updateFilter({
            ...filter,
            l2: v as LayerId,
            i2: findLayer(layers, v as LayerId)!.items[0].itemId
          })}>
            {layerSelectItems}
          </Select>
          <Select value={i2?.itemId || ''} onChange={(v) => updateFilter({...filter, i2: v as LayerItemId})}>
            {l2?.items.map(it => ({label: it.name, value: it.itemId})) || []}
          </Select>
        </Item>
      </Items>
      </div>
      <DelButton variant={"outlined"} onClick={remove}><DeleteIcon/></DelButton>
    </Container>
  );
}