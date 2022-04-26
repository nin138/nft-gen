import React from "react";
import styled from "@emotion/styled";
import {Box} from "@mui/material";
import {LayerActionCreator} from "../../../data/layer/layerStore";
import {LayerItem} from "../../../data/layer/layer";



const LayerName = styled.h1`

`;

type Props = {
  item: LayerItem
  la: LayerActionCreator
}

export const LayerItemEditor: React.FC<Props> = ({item, la}) => {
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <LayerName>
        {item.name}
      </LayerName>
      <img width={300} height={'auto'} src={item.image.dataUrl} />
    </Box>
  );
};
