import React, {useRef} from "react";
import {Layer} from "../../data/layer/layer";
import {Box, Paper, styled, TextField} from "@mui/material";
import {ImgDropZone} from "./ImgDropZone";
import {LayerActionCreator} from "../../data/layer/layerStore";
import {LayerItemEditor} from "./Item/LayerItem";
import {useDraggable} from "react-use-draggable-scroll";


const Head = styled('div')({
  display: 'flex',
  alignItems: "center",
});

type Props = {
  layer: Layer
  la: LayerActionCreator
}

const Container = styled(Paper)({
  width: '90vw',
  margin: '24px auto',
  padding: 24,
});


const ItemContainer = styled(Paper)({
  userSelect: "none",
  display: "flex",
  margin: '24px auto 0',
  padding: 24,
  overflowX: 'scroll',
  width: '100%',
  '&::-webkit-scrollbar': {
    height: '8px',
    width: '8px',

  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: 8,
    background: '#222',
  },
  '&::-webkit-scrollbar-track': {
    borderRadius: 8,
    background: '#555',
  },
  '&::-webkit-scrollbar-corner': {
    display: 'none',
  },
});

export const LayerEditor: React.FC<Props> = ({layer, la}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { events } = useDraggable(ref as any, { applyRubberBandEffect: true });
  return (
    <Container elevation={6}>
      <Head>
        <TextField label={'layer'} size={"small"} value={layer.name} onChange={event => la.updateLayer(layer.layerId, l => ({ ...l, name: event.target.value }))} />
        <ImgDropZone layerId={layer.layerId} la={la} />
      </Head>
      <ItemContainer {...events} ref={ref}>
        {layer.items.map(it => <LayerItemEditor key={it.itemId} layerId={layer.layerId} item={it} la={la} />)}
      </ItemContainer>
    </Container>
  );
};
