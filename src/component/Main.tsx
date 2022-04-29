import React, {useMemo, useRef, useState} from "react";
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
  const f = useFilter();
  const all = useMemo(() => getAll(layers, f.filters), [f.filters, layers])
  const picked = useMemo(() => pick(layers, all, config.numberOfToken), [layers, config, all]);
  const used = useMemo(() => countUsed(layers, picked), [layers, picked]);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const aEl = useRef<HTMLAnchorElement>(null);

  if (loading) return <p>Loading...</p>

  const handleCreateImage = async () => {
    setCreating(true);
    const zip = createZip();
    const canvas = canvasEl.current!;
    const ctx = canvas.getContext('2d')!;
    const itemList = indexToItem(layers, picked);
    let i = 1;
    for(let items of itemList) {
      await renderCanvas(ctx, config.size, items);
      zip.addFile(`${i}.png`, await canvasToBlob(canvas));
      i++;
    }
    const data = await zip.create();
    const url = window.URL.createObjectURL(data as any);
    aEl.current!.href = url;
    aEl.current!.click();
    setCreating(false);
  }

  return (
    <Container>
      <GeneralEditor config={config} setConfig={setConfig} generatable={all.length} />
      <Filters layers={layers} f={f} />
      <Editor layers={layers} la={la} usedCount={used} />
      <FloatingButtonArea>
        <FloatingButton color={"primary"} variant="extended" onClick={() => setPreview(!preview)}>
          <PreviewIcon sx={{ mr: 1 }} />
          Preview
        </FloatingButton>
        <FloatingButton disabled={creating || all.length < config.numberOfToken } color={"secondary"} variant="extended" onClick={handleCreateImage}>

          <CreateImageIcon sx={{ mr: 1 }} />
          Create Images
        </FloatingButton>
      </FloatingButtonArea>

      <Preview open={preview} config={config} layers={layers} items={all.length >= config.numberOfToken ? picked : []} />
      <canvas style={{display: "none"}} ref={canvasEl} width={config.size.w} height={config.size.h} />
      <a ref={aEl} style={{display: "none"}} />
    </Container>
  );
};
