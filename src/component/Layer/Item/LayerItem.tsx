import React from "react";
import {Card, Slider, styled, TextField} from "@mui/material";
import {LayerActionCreator} from "../../../data/layer/layerStore";
import {LayerId, LayerItem} from "../../../data/layer/layer";
import {DragIconWrap} from "../../Atoms/DragIcon";
import {DragIcon} from "../../Icons";
import {Draggable} from "react-beautiful-dnd";



const Header = styled('div')({
  display: 'flex',
  justifyContent: "space-evenly",
  alignItems: "center",
  marginBottom: 16,
});

type Props = {
  layerId: LayerId
  item: LayerItem
  la: LayerActionCreator
  index: number
}

const Container = styled(Card)({
  margin: 8,
  width: 210,
  flex: '0 0 210px',
  padding: 12,
})

export const LayerItemEditor: React.FC<Props> = ({layerId, item, la, index}) => {
  return (
    <Draggable draggableId={item.itemId} index={index}>
      {provided => (
        <Container ref={provided.innerRef} {...provided.draggableProps} elevation={2}>
          <Header>
            <TextField style={{width: '70%'}} label={'name'} size={"small"} value={item.name} onChange={event => la.updateLayerItem(layerId, item.itemId,l => ({ ...l, name: event.target.value }))} />
            <DragIconWrap {...provided.dragHandleProps} data-dnd={true} elevation={4}>
              <DragIcon fontSize={'medium'} />
            </DragIconWrap>
          </Header>
          <div>
            weight: {item.weight}
            <Slider value={item.weight} min={1} max={100} onChange={(_, v) => la.updateLayerItem(layerId, item.itemId, l => ({...l, weight: v as number}))} />
          </div>
          <img width={180} height={'auto'} src={item.image.dataUrl} />
        </Container>
      )}
    </Draggable>
  );
};
