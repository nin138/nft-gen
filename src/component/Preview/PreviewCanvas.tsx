import React, {useCallback, useEffect, useRef, useState} from "react";
import {styled} from "@mui/material";
import {Size} from "../../data/configStore";
import {LayerItem} from "../../data/layer/layer";

type Props = {
  size: Size
  items: LayerItem[]
}

const Canvas = styled("canvas")({
  display: 'block',
  width: '100%',
});

export const PreviewCanvas: React.FC<Props> = ({size, items}) => {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if(!ref.current) return;
    const ctx = ref.current.getContext('2d')!;
    ctx.clearRect(0, 0, size.w, size.h);
    items.forEach(it => {
      const image = new Image();
      image.src = it.image.dataUrl;
      image.onload = () => ctx.drawImage(image, 0, 0, size.w, size.h);
    },)
    return () => ctx.clearRect(0, 0, size.w, size.h);
  }, [size, items, ref])
  return (
      <Canvas width={size.w} height={size.h} ref={ref} />
  );
};