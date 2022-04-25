import {Image} from "../logics/imageStorage";

export type Layer = {
  name: string;
  item: LayerItem[]
};

export type LayerItem = {
  name: string;
  image: Image;
}


