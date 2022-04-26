import {Image} from "../../logics/imageStorage";
import {nanoid} from "nanoid";

export type LayerId = string & { _type: 'LayerID' }
export type LayerItemId = string & { _type: 'LayerItemID' }

const createLayerId = (): LayerId => `l:${nanoid()}` as LayerId;
const createLayerItemId = (): LayerItemId => `li:${nanoid()}` as LayerItemId;

export type Layer = {
  layerId: LayerId
  name: string;
  items: LayerItem[]
};

export type LayerItem = {
  itemId: LayerItemId;
  name: string;
  image: Image;
}

export const createLayer = (name: string): Layer => ({
  layerId: createLayerId(),
  name,
  items: [],
});

export const createLayerItem = (name: string, image: Image): LayerItem => ({
  itemId: createLayerItemId(),
  name,
  image,
});