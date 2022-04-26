import React, {useCallback, useEffect, useRef, useState} from "react";
import {styled} from "@mui/material";
import {Size} from "../../data/configStore";
import {Image as A} from "../../logics/imageStorage";

type Props = {
  size: Size
  images: A[]
}

const Canvas = styled("canvas")({
  width: '100%',
});

export const PreviewCanvas: React.FC<Props> = ({size, images}) => {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if(!ref.current) return;
    const ctx = ref.current.getContext('2d')!;
    ctx.clearRect(0, 0, size.w, size.h);
    images.forEach(it => {
      const image = new Image();
      image.src = it.dataUrl;
      image.onload = () => ctx.drawImage(image, 0, 0, size.w, size.h);
    },)
  }, [size, images, ref])
  return (
      <Canvas width={size.w} height={size.h} ref={ref} />
  );
};