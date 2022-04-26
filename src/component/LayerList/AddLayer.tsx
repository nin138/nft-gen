import React from "react";
import {Button} from "@mui/material";
import {LayerActionCreator} from "../../data/layer/layerStore";

type Props = {
  la: LayerActionCreator
};

export const AddLayer: React.FC<Props> = ({la}) => {
  return (
    <div>
      <Button variant={'outlined'} onClick={() => la.addLayer()}>ADD LAYER</Button>
    </div>
  );
};
