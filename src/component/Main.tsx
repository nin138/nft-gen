import React, {useState} from "react";
import {Box} from "@mui/material";
import {useLayers} from "../data/layer/layerStore";
import {LayerList} from "./LayerList/LayerList";
import {LayerId} from "../data/layer/layer";
import {GeneralEditor} from "./Layer/General";
import {LayerEditor} from "./Layer/Layer";

export const GENERAL_ID = 'general' as LayerId;

export const Main: React.FC = () => {
  const {loading, la, layers} = useLayers();

  if(loading) return <p>Loading...</p>

  return (
    <div style={{display: 'flex'}}>
      <Box style={{flex: '1 1 100%'}}>
        <GeneralEditor />
        {layers.map(it => <LayerEditor key={it} layer={it} la={la} />)}
      </Box>
    </div>
  );
};