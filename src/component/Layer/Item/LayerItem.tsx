import React from "react";
import {Box, styled, TextField} from "@mui/material";
import {LayerActionCreator} from "../../../data/layer/layerStore";
import {LayerId, LayerItem} from "../../../data/layer/layer";



const LayerName = styled('div')({

});

type Props = {
  layerId: LayerId
  item: LayerItem
  la: LayerActionCreator
}

const Container = styled('div')({

})

export const LayerItemEditor: React.FC<Props> = ({layerId, item, la}) => {
  return (
    <Container>
      <LayerName>
        <TextField label={'name'} size={"small"} value={item.name} onChange={event => la.updateLayerItem(layerId, item.itemId,l => ({ ...l, name: event.target.value }))} />
      </LayerName>
      <img width={300} height={'auto'} src={item.image.dataUrl} />
    </Container>
  );
};
