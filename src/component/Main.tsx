import React, {useCallback, useMemo, useRef, useState} from "react";
import {useLayers} from "../data/layer/layerStore";
import {Editor} from "./Editor/Editor";
import {Fab, styled} from "@mui/material";
import {CreateImageIcon, ExportIcon, ImportIcon, PreviewIcon} from "./Icons";
import {useConfig} from "../data/configStore";
import {GeneralEditor} from "./Layer/General";
import {Preview, sliceArray} from "./Preview/Preview";
import {canvasToBlob, createZip, renderCanvas} from "../logics/images/toZip";
import {Filters} from "./Filter/Filters";
import {useFilter} from "../data/filterStore";
import {FixedImageList} from "./FixedItems/FixedImageList";
import {FixedItemId, useFixedImage} from "../data/fixedItems";
import {DragDropContext, DragDropContextProps} from "react-beautiful-dnd";
import { LayerId, LayerItemId} from "../data/layer/layer";
import {DeleteDroppable} from "./Atoms/DeleteDroppable";
import {writeLog} from "../logics/console";
import {createImageData} from "../logics/createImages/createImageData";
import {compileFilters} from "../data/Filter";
import {indexToItem} from "../logics/createImages/getAllAndPick";
import {exportPrj, importPrj} from "../logics/io/io";
import {ImportPrjModal} from "./ImportPrjModal";
import {ImageStorage} from "../logics/imageStorage";

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
  const compiledFilters = useMemo(() => compileFilters(f.filters, layers), [f.filters, layers]);
  const fixedIndexes = useMemo(() => images
    .map(image => image.items.map((i, l) => layers[l]?.items.findIndex(it => it.itemId === i)))
    .filter(it => !it.includes(-1)), [images, layers]);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const aEl = useRef<HTMLAnchorElement>(null);

  const [dragging, setDragging] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);

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
    writeLog('start create')
    const indexes = createImageData(layers, config.numberOfToken, compiledFilters, fixedIndexes)
    writeLog('end calc')
    const canvas = canvasEl.current!;
    const ctx = canvas.getContext('2d')!;
    const itemList100 = sliceArray(indexToItem(layers, indexes), 1000);
    writeLog('end slice')
    let loop = 0;
    let i = 1;
    const date = new Date();

    for (let itemList of itemList100) {
      const zip = createZip();
      loop++;
      writeLog(`zip loop: ${loop}`);
      for (let items of itemList) {
        await renderCanvas(ctx, config.size, items);
        zip.addFile(`${i}.png`, await canvasToBlob(canvas));
        i++;
      }
      const data = await zip.create();
      aEl.current!.href = window.URL.createObjectURL(data as any);
      aEl.current!.download = `${config.name}-${date.toLocaleDateString()}-${i.toString().padStart(2, '0')}.zip`
      aEl.current!.click();
    }
    setCreating(false);
  }

  const handleExport = async () => {
    const exp = await exportPrj(config, layers, f.filters, images);
    const date = new Date();

    aEl.current!.href = window.URL.createObjectURL(exp);
    aEl.current!.download = `Tempuragen-${config.name}-${date.toLocaleDateString()}.zip`;
    aEl.current!.click();
  }


  const handleImport = () => {
    setOpenImportModal(true);
  }

  const onImport = async (zip: File) => {
    const prj = await importPrj(zip);
    setConfig(prj.config);
    la.onRestore(await Promise.all(prj.layers.map(async it => ({...it, items: await Promise.all(it.items.map(async it => ({...it, image: await ImageStorage.restore(it.image.key)})))}))));
    actions.reinit(prj.fixed);
    f.reinitFilter(prj.filters);
  }

  return (
    <DragDropContext onBeforeDragStart={onBeforeDragStart} onDragEnd={onDragEnd}>
      <Container>
        <GeneralEditor config={config} setConfig={setConfig} generatable={0}/>
        <FixedImageList images={images} actions={actions} layers={layers} config={config}/>
        <Filters layers={layers} f={f}/>
        <Editor layers={layers} la={la} />
        <FloatingButtonArea>
          <FloatingButton color={"default"} variant="extended" onClick={handleImport}>
            <ImportIcon sx={{mr: 1}}/>
            Upload Saved File
          </FloatingButton>
          <FloatingButton color={"default"} variant="extended" onClick={handleExport}>
            <ExportIcon sx={{mr: 1}}/>
            Save as File
          </FloatingButton>
          <FloatingButton color={"primary"} variant="extended" onClick={() => setPreview(!preview)}>
            <PreviewIcon sx={{mr: 1}}/>
            Preview
          </FloatingButton>
          <FloatingButton disabled={creating} color={"secondary"}
                          variant="extended" onClick={handleCreateImage}>
            <CreateImageIcon sx={{mr: 1}}/>
            Create Images
          </FloatingButton>
        </FloatingButtonArea>
        {preview && <Preview open={preview} config={config} layers={layers} fixed={fixedIndexes} filters={compiledFilters} />}
        <canvas style={{display: "none"}} ref={canvasEl} width={config.size.w} height={config.size.h}/>
        <a ref={aEl} style={{display: "none"}}/>
      </Container>
      <DeleteDroppable dragging={dragging}/>
      <ImportPrjModal open={openImportModal} onImport={onImport} close={() => setOpenImportModal(false)} />
    </DragDropContext>
  );
};
