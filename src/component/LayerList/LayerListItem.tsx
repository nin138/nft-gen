import React from "react";
import {Layer, LayerId} from "../../data/layer/layer";
import {styled, TextField} from "@mui/material";
import './LayerList.css';
import {LayerActionCreator} from "../../data/layer/layerStore";

const height = '72px';
const Wrap = styled('div')({
  flex: '0 0 300px',
  padding: 16,
  height,
  position: "relative",
  ":hover": {
    background: '#fff5',
  },
  cursor: "pointer",

});

type Props = {
  layer: Layer;
  selected: boolean;
  updateLayer: LayerActionCreator['updateLayer']
  onClick: (id: LayerId) => void;
}

export const LayerListItem: React.FC<Props> = ({layer, selected, onClick, updateLayer}) => {
  return (
    <Wrap className={selected ? 'selectedItem' : ''} onClick={() => onClick(layer.layerId)} >
      <TextField label={'layer'} size={"small"} value={layer.name} onChange={event => updateLayer(layer.layerId, l => ({ ...l, name: event.target.value }))} />
    </Wrap>
  );
};
