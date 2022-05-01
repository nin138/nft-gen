import React, {useCallback, useState} from "react";
import {styled} from "@mui/material";
import {DragDropContext, DragDropContextProps, Droppable} from "react-beautiful-dnd";
import {Layer, LayerId, LayerItemId} from "../../data/layer/layer";
import {LayerActionCreator} from "../../data/layer/layerStore";
import {GeneralEditor} from "../Layer/General";
import {LayerEditor} from "../Layer/Layer";
import {AddLayer} from "../LayerList/AddLayer";
import {DeleteDroppable} from "../Atoms/DeleteDroppable";

const LayerList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '90vw',
  margin: 'auto',
});

type Props = {
  layers: Layer[]
  la: LayerActionCreator;
  usedCount: number[][]
}

export const Editor: React.FC<Props> = ({layers, la, usedCount}) => {
  return (
    <div style={{display: 'flex'}}>
      <Droppable droppableId={'Layer'} type={'Layer'}>
        {(drop) => (
          <LayerList ref={drop.innerRef} {...drop.droppableProps}>
            {layers.map((it, i) => (
              <LayerEditor key={it.layerId} layer={it} la={la} index={i} usedCount={usedCount[i]}/>))}
            <AddLayer la={la}/>
            {drop.placeholder}
          </LayerList>
        )}
      </Droppable>
    </div>
  );
};