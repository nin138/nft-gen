import {Layer, LayerId, LayerItemId} from "./layer/layer";
import {useMemo, useState, useEffect} from "react";
import {nanoid} from "nanoid";
import {Filter, FilterTypes} from "./Filter";

export type FixedItemId = string & { _type: 'FIXED_ITEM' }

export type FixedImage = {
  id: FixedItemId;
  items: LayerItemId[]
};

const KEY = '_FIXED_ITEM_'
const FixedImageStorage = {
  save: (images: FixedImage[]) => localStorage.setItem(KEY, JSON.stringify(images)),
  restore: (): FixedImage[] => {
    const data = localStorage.getItem(KEY)
    if(!data) return [];
    return JSON.parse(data);
  },
}
export type FixedImageActions = {
  update: (id: FixedItemId, image: FixedImage) => void;
  add: (items: LayerItemId[]) => void;
  remove: (id: FixedItemId) => void;
}

export type FixedImageState = {
  images: FixedImage[];
  actions: FixedImageActions;
}

const createFixedItem = (items: LayerItemId[]): FixedImage => ({
  id: `f:${nanoid()}` as FixedItemId,
  items,
})

export const useFixedImage = (): FixedImageState => {
  const [images, setImages] = useState<FixedImage[]>([]);
  const update = (id: FixedItemId, image: FixedImage) => setImages(images => images.map((it) => it.id === id ? image : it));
  const add = (items: LayerItemId[]) => {
    setImages(images => [...images, createFixedItem(items)])
  }
  const remove = (id: FixedItemId) => setImages(images => images.filter((it) => it.id !== id));
  useEffect(() => {
    const data = FixedImageStorage.restore();
    if(data) setImages(data);

    const cb = () => setImages(c => {
      FixedImageStorage.save(c);
      return c;
    })
    window.addEventListener("beforeunload", cb);
    return () => window.removeEventListener("beforeunload", cb);
  }, []);

  return useMemo(() => ({
    images,
    actions: {
      update,
      add,
      remove,
    }
  }), [images,]);
}


