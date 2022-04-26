import React from "react";
import {Layer} from "../../data/layer/layer";
import {Box, Paper, styled} from "@mui/material";
import {ImgDropZone} from "./ImgDropZone";
import {LayerActionCreator} from "../../data/layer/layerStore";
import {LayerItemEditor} from "./Item/LayerItem";


const LayerName = styled('h1')({

});

type Props = {
  layer: Layer
  la: LayerActionCreator
}

const ItemContainer = styled(Paper)({
  display: "flex",
  width: '80%',
  margin: '24px auto',
  padding: 24,
  overflowX: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

export const LayerEditor: React.FC<Props> = ({layer, la}) => {
  return (
    <Box display={"flex"} justifyContent={"center"} flexDirection={'column'}>
      <LayerName>
        {layer.name}
      </LayerName>
      <ImgDropZone layerId={layer.layerId} la={la} />
      <ItemContainer>
        {layer.items.map(it => <LayerItemEditor key={it.itemId} item={it} la={la} />)}
      </ItemContainer>
    </Box>
  );
};
