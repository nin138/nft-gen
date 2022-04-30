import React from "react";
import {FixedImage, FixedImageActions} from "../../data/fixedItems";
import {Button, Paper, styled} from "@mui/material";
import {FixedItemEditor} from "./FixedItemEditor";
import {Layer} from "../../data/layer/layer";
import {Config} from "../../data/configStore";

type Props = {
  images: FixedImage[]
  actions: FixedImageActions;
  layers: Layer[]
  config: Config
}

export const FixedImageList: React.FC<Props> = ({images, actions, layers, config}) => {
  return (
    <div>
      {images.map((image, i)=> <FixedItemEditor key={image.id} index={i} image={image} _layers={layers} config={config} action={actions} />)}
      <Button variant={"outlined"} onClick={() => actions.add([])}>add fixed image</Button>
    </div>
  );
};
