import React, {useCallback, useMemo, useRef, useState} from "react";
import {useLayers} from "../data/layer/layerStore";
import {Editor} from "./Editor/Editor";
import {Fab, styled} from "@mui/material";
import {CreateImageIcon, PreviewIcon} from "./Icons";
import {useConfig} from "../data/configStore";
import {GeneralEditor} from "./Layer/General";
import {Preview} from "./Preview/Preview";
import {countUsed, getAll, indexToItem, pick} from "../logics/combine/getAll";
import {canvasToBlob, createZip, renderCanvas} from "../logics/images/toZip";
import {Filters} from "./Filter/Filters";
import {useFilter} from "../data/filterStore";
import {FixedImageList} from "./FixedItems/FixedImageList";
import {FixedItemId, useFixedImage} from "../data/fixedItems";
import {DragDropContext, DragDropContextProps} from "react-beautiful-dnd";
import {LayerId, LayerItemId} from "../data/layer/layer";
import {DeleteDroppable} from "./Atoms/DeleteDroppable";

const Container = styled('div')({
  width: '90%',
  margin: "auto",
})

const FloatingButtonArea = styled('section')({
  position: "fixed",
  bottom: 0,
  display: "flex",
  justifyContent: "flex-end",
  width: '100%',
  padding: 24,
  zIndex: 2000,
  pointerEvents: "none",
  left: 0,
})

const FloatingButton = styled(Fab)({
  pointerEvents: 'all',
  margin: '0 16px',
});

export const Main: React.FC = () => {
  const {config, setConfig} = useConfig();
  const {loading, la, layers} = useLayers();
  const [preview, setPreview] = useState(false);
  const [creating, setCreating] = useState(false);
  const {images, actions} = useFixedImage();
  const f = useFilter();
  const fixedIndexes = useMemo(() => images
    .map(image => image.items.map((i, l) => layers[l]?.items.findIndex(it => it.itemId === i)))
    .filter(it => !it.includes(-1)), [images, layers]);
  const all = useMemo(() => getAll(layers, f.filters, fixedIndexes), [f.filters, fixedIndexes, layers])
  const picked = useMemo(() => pick(layers, all, config.numberOfToken - fixedIndexes.length), [layers, all, config.numberOfToken, fixedIndexes.length]);
  const indexes = useMemo(() => [...fixedIndexes, ...picked], [fixedIndexes, picked])
  const used = useMemo(() => countUsed(layers, indexes), [layers, indexes]);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const aEl = useRef<HTMLAnchorElement>(null);

  const [dragging, setDragging] = useState(false);

  const onBeforeDragStart: DragDropContextProps['onBeforeDragStart'] = useCallback(() => {
    setDragging(true);
  }, []);

  const onDragEnd: DragDropContextProps['onDragEnd'] = useCallback((result, provided) => {
    setDragging(false);
    if (!result.destination) return;
    if(result.destination.droppableId === 'DFI') {
      actions.remove(result.draggableId as FixedItemId)
    }
    else if(result.destination.droppableId === 'FixedItem') {
      actions.swap(result.source.index, result.destination.index);
    }
    else if (result.destination.droppableId === 'DLL') {
      la.rmLayer(result.draggableId as LayerId);
    } else if (result.destination.droppableId === 'Layer') {
      la.swapLayer(result.source.index, result.destination?.index);
    } else if (result.destination.droppableId === 'DLI') {
      la.rmLayerItem(result.source.droppableId as LayerId, result.draggableId as LayerItemId);
    } else {
      la.swapLayerItem(result.source.droppableId as LayerId, result.destination.droppableId as LayerId, result.source.index, result.destination.index)
    }
  }, [actions, la]);

  if (loading) return <p>Loading...</p>

  const handleCreateImage = async () => {
    setCreating(true);
    const zip = createZip();
    const canvas = canvasEl.current!;
    const ctx = canvas.getContext('2d')!;
    const itemList = indexToItem(layers, indexes);
    let i = 1;
    for (let items of itemList) {
      await renderCanvas(ctx, config.size, items);
      zip.addFile(`${i}.png`, await canvasToBlob(canvas));
      i++;
    }
    const data = await zip.create();
    aEl.current!.href = window.URL.createObjectURL(data as any);
    aEl.current!.click();
    setCreating(false);
  }

  return (
    <DragDropContext onBeforeDragStart={onBeforeDragStart} onDragEnd={onDragEnd}>
      <Container>
        <GeneralEditor config={config} setConfig={setConfig} generatable={all.length + fixedIndexes.length}/>
        <FixedImageList images={images} actions={actions} layers={layers} config={config}/>
        <Filters layers={layers} f={f}/>
        <Editor layers={layers} la={la} usedCount={used}/>
        <FloatingButtonArea>
          <FloatingButton color={"primary"} variant="extended" onClick={() => setPreview(!preview)}>
            <PreviewIcon sx={{mr: 1}}/>
            Preview
          </FloatingButton>
          <FloatingButton disabled={creating || all.length < config.numberOfToken} color={"secondary"}
                          variant="extended" onClick={handleCreateImage}>
            <CreateImageIcon sx={{mr: 1}}/>
            Create Images
          </FloatingButton>
        </FloatingButtonArea>
        <Preview open={preview} config={config} layers={layers}
                 items={all.length >= config.numberOfToken ? indexes : []}/>
        <canvas style={{display: "none"}} ref={canvasEl} width={config.size.w} height={config.size.h}/>
        <a ref={aEl} style={{display: "none"}}/>
      </Container>
      <DeleteDroppable dragging={dragging}/>
    </DragDropContext>
  );
};
