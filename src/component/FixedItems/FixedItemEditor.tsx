import React from "react";
import {FixedImage, FixedImageActions} from "../../data/fixedItems";
import {Layer, LayerItem, LayerItemId,} from "../../data/layer/layer";
import {Config, } from "../../data/configStore";
import {Paper, styled} from "@mui/material";
import {Select} from "../Atoms/Select";
import {PreviewCanvas} from "../Preview/PreviewCanvas";
import {scrollbarStyle} from "../Atoms/scrollbarStyle";
import {Draggable, Droppable} from "react-beautiful-dnd";
import {DragIcon} from "../Icons";
import {DragIconWrap} from "../Atoms/DragIcon";

const Container = styled(Paper)({
  display: 'flex',
  padding: 12,
  margin: '24px 0',
  justifyContent: "space-between",
});

const Img = styled('img')({
  width: 180,
});

const Items = styled('div')({
  display: "flex",
  width: '100%',
});

const Item = styled(Paper)({
  display: 'flex',
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "center",
  padding: 12,
  margin: 8,
  background: '#555',
});

const CanvasContainer = styled('div')({
  width: 180,
});

const ScrollContainer = styled(Paper)({
  userSelect: "none",
  display: "flex",
  margin: '8px auto 0',
  padding: '8px 24px',
  overflowX: 'scroll',
  ...scrollbarStyle,
});

type Props = {
  index: number;
  image: FixedImage
  _layers: Layer[]
  config: Config
  action: FixedImageActions;
}

export const FixedItemEditor: React.FC<Props> = ({image, _layers, config, index, action}) => {
  const layers = _layers.filter(it => it.items.length !== 0);
  const items = image.items.map((i, l) => layers[l]?.items.find(it => it.itemId === i));
  const valid = items.length === layers.length && !items.includes(undefined);

  const update = (index: number) => (value: string) => {
    action.update(image.id, {
      id: image.id,
      items: layers.map((_, i) => i === index ? value as LayerItemId : image.items[i]),
    });
  }
  return (
    <Draggable draggableId={image.id} index={index}>
      {
        drag => (
          <Container elevation={4} {...drag.draggableProps} ref={drag.innerRef}>
            <Items>
              <Item elevation={4} style={{backgroundColor: valid ? undefined : '#f00'}}>
                {valid && (
                  <CanvasContainer>
                    <PreviewCanvas size={config.size} items={items as LayerItem[]} />
                  </CanvasContainer>
                )}
                <p>{config.name} #{index + 1}</p>
              </Item>
              <ScrollContainer elevation={4}>
                {layers.map((item, l) => (
                  <Item key={l}>
                    <Img src={items[l]?.image.dataUrl} />
                    <div>{item.name}</div>
                    <Select value={items[l]?.itemId || ''} onChange={update(l)}>
                      {layers[l].items.map(it => ({label: it.name, value: it.itemId})) || []}
                    </Select>
                  </Item>
                ))}
              </ScrollContainer>
              <DragIconWrap {...drag.dragHandleProps} elevation={4}>
                <DragIcon fontSize={'medium'} />
              </DragIconWrap>
            </Items>
          </Container>
        )
      }
    </Draggable>
  )
}
