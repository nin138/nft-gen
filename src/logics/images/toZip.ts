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

export const renderCanvas = (ctx: CanvasRenderingContext2D, size: Size, items: LayerItem[]) => {
  return new Promise(resolve => {
    let i = items.length;
    ctx.clearRect(0, 0, size.w, size.h);
    items.forEach(it => {
      const image = new Image();
      image.src = it.image.dataUrl;
      image.onload = () => {
        ctx.drawImage(image, 0, 0, size.w, size.h);
        i -= 1;
        if(i === 0) resolve(true);
      }
    })
  })
}

export const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
  return new Promise((resolve, reject) =>  {
    canvas.toBlob((blob) => {
      if(blob) resolve(blob);
      reject('fail to canvas to blob');
    }, 'image/png');
  })
}
