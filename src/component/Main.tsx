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
  const [selectedLayerId, setSelectedLayerId] = useState<LayerId>(GENERAL_ID);

  if(loading) return <p>Loading...</p>

  const body = () => {
    if(selectedLayerId === GENERAL_ID) return <GeneralEditor />;
    const selectedLayer = layers.find(it => it.layerId === selectedLayerId);
    return <LayerEditor layer={selectedLayer!} la={la} />;
  }

  return (
    <div style={{display: 'flex'}}>
      <LayerList layers={layers} selectedId={selectedLayerId} la={la} setSelectedLayer={setSelectedLayerId} />
      <Box style={{flex: '1 1 100%'}}>
        {body()}
      </Box>
    </div>
  );
};