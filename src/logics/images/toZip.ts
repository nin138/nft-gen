import Zip from 'jszip';
import {Size} from "../../data/configStore";
import {LayerItem} from "../../data/layer/layer";

export const createZip = () => {
  const zip = new Zip();
  return {
    addFile: (fileName: string, file: Blob) => zip.file(fileName, file),
    create: () => zip.generateAsync({ type: 'blob', platform: 'DOS'}),
  };
}

const renderImage =  (ctx: CanvasRenderingContext2D, size: Size, item: LayerItem) => {
  return new Promise(resolve => {
    const image = new Image();
    image.src = item.image.dataUrl;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, size.w, size.h);
      resolve(true);
    }
  })
}

export const renderCanvas = async (ctx: CanvasRenderingContext2D, size: Size, items: LayerItem[]) => {
  ctx.clearRect(0, 0, size.w, size.h);
  for (let item of items) {
    await renderImage(ctx, size, item);
  }
}

export const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
  return new Promise((resolve, reject) =>  {
    canvas.toBlob((blob) => {
      if(blob) resolve(blob);
      reject('fail to canvas to blob');
    }, 'image/png');
  })
}
