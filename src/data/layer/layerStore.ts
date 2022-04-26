import {createLayer, createLayerItem, Layer, LayerId, LayerItem, LayerItemId} from "./layer";
import {useEffect, useMemo, useReducer, useState} from "react";
import {Image, ImageStorage} from "../../logics/imageStorage";

type Layers = Layer[]

const KEY = 's_layers'


const restoreLayerItem = async (item: LayerItem): Promise<LayerItem> => {
  return {
  ...item,
    image: await ImageStorage.restore(item.image.key),
  }
};

const LayerStorage = {
  save: (layers: Layers) => localStorage.setItem(KEY, JSON.stringify(layers)),

  restore: async (): Promise<Layers | null> => {
    const json = localStorage.getItem(KEY);
    if(!json) return null;
    const layers: Layers = JSON.parse(json);
    return Promise.all(layers.map(async it => ({
      ...it,
      items: await Promise.all(it.items.map(restoreLayerItem)),
    })));
  }
};


const ActionTypes = {
  AddLayer: 'AddLayer',
  UpdateLayer: 'UpdateLayer',
  AddLayerItem: 'AddLayerItem',
  UpdateLayerItem: 'UpdateLayerItem',
  SwapLayer: 'SwapLayer',
  SwapLayerItem: 'SwapLayerItem',
  BeforeUnload: 'BeforeUnload',
  OnRestore: 'OnRestore',
} as const;

type AddLayer = {
  type: typeof ActionTypes.AddLayer,
}

type UpdateLayer = {
  type: typeof ActionTypes.UpdateLayer,
  layerId: LayerId,
  action: (layer: Layer) => Layer,
};

type AddLayerItem = {
  type: typeof ActionTypes.AddLayerItem,
  layerId: LayerId,
  image: Image,
}

type UpdateLayerItem = {
  type: typeof ActionTypes.UpdateLayerItem,
  layerId: LayerId,
  layerItemId: LayerItemId,
  action: (layer: LayerItem) => LayerItem,
};

type SwapLayer = {
  type: typeof ActionTypes.SwapLayer
  from: LayerId,
  to: LayerId
}

type SwapLayerItem = {
  type: typeof ActionTypes.SwapLayerItem
  layerId: LayerId,
  from: LayerItemId,
  to: LayerItemId
}

type BeforeUnload = {
  type: typeof ActionTypes.BeforeUnload
}

type OnRestore = {
  type: typeof ActionTypes.OnRestore
  layers: Layers
}

type Actions = AddLayer | UpdateLayer | AddLayerItem | UpdateLayerItem | SwapLayer | SwapLayerItem | BeforeUnload | OnRestore;

const updateLayer = (layers: Layers, layerId: LayerId, action: (layer: Layer) => Layer): Layers => layers.map(it => it.layerId !== layerId ? it : action(it));
const updateLayerItem = (layer: Layer, itemId: LayerItemId, action: (layer: LayerItem) => LayerItem): Layer => ({
  ...layer,
  items: layer.items.map(it => it.itemId !== itemId ? it : action(it))
});

const swap = <T extends unknown>(arr: T[], fromIndex: number, toIndex: number): T[] => {
  const r = [...arr];
  r[fromIndex] = arr[toIndex];
  r[toIndex] = arr[fromIndex];
  return r;
};

const findLayerIndex = (layers: Layers, layerId: LayerId) => layers.findIndex(it => it.layerId === layerId);
const findLayerItemIndex = (layer: Layer, itemId: LayerItemId) => layer.items.findIndex(it => it.itemId === itemId);

const reducer = (layers: Layers, action: Actions): Layers => {
  switch (action.type) {
    case ActionTypes.AddLayer: return [...layers, createLayer( `Layer${layers.length}`)];
    case ActionTypes.UpdateLayer: return updateLayer(layers, action.layerId, action.action);
    case ActionTypes.AddLayerItem: return updateLayer(layers, action.layerId, layer => ({...layer, items: [...layer.items, createLayerItem(`item${layer.items.length}`, action.image) ]}))
    case ActionTypes.UpdateLayerItem: return updateLayer(layers, action.layerId, layer => updateLayerItem(layer, action.layerItemId, action.action));
    case ActionTypes.SwapLayer: return swap(layers, findLayerIndex(layers, action.from), findLayerIndex(layers, action.to));
    case ActionTypes.SwapLayerItem: return updateLayer(layers, action.layerId, layer => ({
      ...layer,
      items: swap(layer.items, findLayerItemIndex(layer, action.from), findLayerItemIndex(layer, action.to))
    }));
    case ActionTypes.BeforeUnload: {
      if(PREV_DATA_LOADED) LayerStorage.save(layers);
      return layers;
    }
    case ActionTypes.OnRestore: {
      return action.layers;
    }
  }
};

let PREV_DATA_LOADED = false;

export class LayerActionCreator {

  constructor(private readonly dd: (action: Actions) => void) {}
  addLayer = () => this.dd({
    type: ActionTypes.AddLayer
  });

  updateLayer = (layerId: LayerId, action: (l: Layer) => Layer) => this.dd({
    type: ActionTypes.UpdateLayer,
    layerId,
    action,
  });

  addLayerItem = (layerId: LayerId, image: Image) => this.dd({
    type: ActionTypes.AddLayerItem,
    layerId,
    image,
  });

  updateLayerItem = (layerId: LayerId, layerItemId: LayerItemId, action: (i: LayerItem) => LayerItem) => this.dd({
    type: ActionTypes.UpdateLayerItem,
    layerId,
    layerItemId,
    action,
  });

  swapLayer = (from: LayerId, to: LayerId,) => this.dd({
    type: ActionTypes.SwapLayer,
    from,
    to,
  });


  swapLayerItem = (layerId: LayerId, from: LayerItemId, to: LayerItemId) => this.dd({
    type: ActionTypes.SwapLayerItem,
    layerId,
    from,
    to,
  });
}

type UseLayers = {
  loading: boolean,
  layers: Layers,
  la: LayerActionCreator,
}
export const useLayers = (): UseLayers => {
  const [loading, setLoading] = useState(true);
  const [layers, dispatch] = useReducer(reducer, [createLayer('background')]);
  const la = useMemo(() => new LayerActionCreator(dispatch), [dispatch]);
  useEffect( () => {
    LayerStorage.restore().then(it => {
      PREV_DATA_LOADED = true;
      if(it) {
        dispatch({
          type: ActionTypes.OnRestore,
          layers: it,
        })
      }
      setLoading(false);
    })

    const cb = () => dispatch({ type: ActionTypes.BeforeUnload });
    window.addEventListener("beforeunload", cb);
    return () => window.removeEventListener("beforeunload", cb);
  }, []);
  return {
    loading,
    layers,
    la,
  };
};


