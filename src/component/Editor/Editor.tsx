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
  const [dragging, setDragging] = useState(false);

  const onBeforeDragStart: DragDropContextProps['onBeforeDragStart'] = useCallback(() => {
    setDragging(true);
  }, []);

  const onDragEnd: DragDropContextProps['onDragEnd'] = useCallback((result, provided) => {
    setDragging(false);
    if (!result.destination) return;
    if (result.destination.droppableId === 'DLL') {
      la.rmLayer(result.draggableId as LayerId);
    }
    else if (result.destination.droppableId === 'Layer') {
      la.swapLayer(result.source.index, result.destination?.index);
    }
    else if (result.destination.droppableId === 'DLI') {
      la.rmLayerItem(result.source.droppableId as LayerId, result.draggableId as LayerItemId);
    } else {
      la.swapLayerItem(result.source.droppableId as LayerId, result.destination.droppableId as LayerId, result.source.index, result.destination.index)
    }
  }, [la]);

  return (
    <div style={{display: 'flex'}}>
      <DragDropContext onBeforeDragStart={onBeforeDragStart} onDragEnd={onDragEnd}>
        <Droppable droppableId={'Layer'} type={'Layer'}>
          {(drop) => (
            <LayerList ref={drop.innerRef} {...drop.droppableProps}>
              {layers.map((it, i) => (<LayerEditor key={it.layerId} layer={it} la={la} index={i} usedCount={usedCount[i]} />))}
              <AddLayer la={la} />
              {drop.placeholder}
            </LayerList>
          )}
        </Droppable>
        <DeleteDroppable dragging={dragging} />
      </DragDropContext>
    </div>
  );
};