import React, {useRef} from "react";
import {Layer} from "../../data/layer/layer";
import { Paper, styled, TextField} from "@mui/material";
import {ImgDropZone} from "./ImgDropZone";
import {LayerActionCreator} from "../../data/layer/layerStore";
import {LayerItemEditor} from "./Item/LayerItem";
import {Draggable, Droppable} from "react-beautiful-dnd";
import {DragIcon} from "../Icons";
import {DragIconWrap} from "../Atoms/DragIcon";
import {scrollbarStyle} from "../Atoms/scrollbarStyle";


const Header = styled('div')({
  display: 'flex',
  alignItems: "flex-start",
  justifyContent: "space-between",
});
const HeaderLeft = styled('div')({
  display: 'flex',
  justifyContent: "space-between",
  alignItems: "center",
});

type Props = {
  layer: Layer
  la: LayerActionCreator
  index: number
  usedCount: number[]
}

const Container = styled(Paper)({
  width: '90vw',
  margin: '24px auto',
  padding: 12,
});


const ItemContainer = styled(Paper)({
  userSelect: "none",
  display: "flex",
  margin: '8px auto 0',
  padding: '8px 24px',
  overflowX: 'scroll',
  width: '100%',
  ...scrollbarStyle,
});

export const LayerEditor: React.FC<Props> = ({layer, la, index, usedCount}) => {
  return (
    <Draggable draggableId={layer.layerId} index={index}>
      {provided => (
        <Container id={layer.layerId} elevation={6} ref={provided.innerRef} {...provided.draggableProps}>
          <Header>
            <HeaderLeft>
              <TextField label={'layer'} size={"small"} value={layer.name} onChange={event => la.updateLayer(layer.layerId, l => ({ ...l, name: event.target.value }))} />
              <ImgDropZone layerId={layer.layerId} la={la} />
            </HeaderLeft>
            <DragIconWrap {...provided.dragHandleProps} elevation={4}>
              <DragIcon fontSize={'medium'} />
            </DragIconWrap>
          </Header>
          <Droppable droppableId={layer.layerId} direction={"horizontal"} type={`LayerItem`}>
            {
              (drop) => (
                <ItemContainer ref={drop.innerRef} elevation={2} {...drop.droppableProps}>
                  {layer.items.map((it, i) => <LayerItemEditor key={it.itemId} layerId={layer.layerId} item={it} la={la} index={i} usedCount={usedCount[i]} />)}
                  {drop.placeholder}
                </ItemContainer>
              )
            }
          </Droppable>
        </Container>
      )}
    </Draggable>
  )

};
