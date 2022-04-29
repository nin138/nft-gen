import React, {useMemo, useRef, useState} from "react";
import {useLayers} from "../data/layer/layerStore";
import {Editor} from "./Editor/Editor";
import {Fab, styled} from "@mui/material";
import {PreviewIcon} from "./Icons";
import {useConfig} from "../data/configStore";
import {GeneralEditor} from "./Layer/General";
import {Preview} from "./Preview/Preview";
import {countUsed, getPicked, indexToItem} from "../logics/combine/getAll";
import {canvasToBlob, createZip, renderCanvas} from "../logics/images/toZip";

const FloatingButtonArea = styled('section')({
  position: "fixed",
  bottom: 0,
  display: "flex",
  justifyContent: "flex-end",
  width: '100vw',
  padding: 24,
  zIndex: 2000,
  pointerEvents: "none",
})

const FloatingButton = styled(Fab)({
  pointerEvents: 'all',
});

export const Main: React.FC = () => {
  const {config, setConfig} = useConfig();
  const {loading, la, layers} = useLayers();
  const [preview, setPreview] = useState(false);
  const [creating, setCreating] = useState(false);
  const picked = useMemo(() => getPicked(layers, config.numberOfToken), [layers, config]);
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
    <div>
      <GeneralEditor config={config} setConfig={setConfig} layers={layers} />
      <Editor layers={layers} la={la} usedCount={used} />
      <FloatingButtonArea>
        <FloatingButton color={"primary"} variant="extended" onClick={() => setPreview(!preview)}>
          <PreviewIcon sx={{ mr: 1 }} />
          Preview
        </FloatingButton>
        <FloatingButton disabled={creating} color={"secondary"} variant="extended" onClick={handleCreateImage}>
          <PreviewIcon sx={{ mr: 1 }} />
          Create Images
        </FloatingButton>
      </FloatingButtonArea>

      <Preview open={preview} config={config} layers={layers} items={picked} />
      <canvas style={{display: "none"}} ref={canvasEl} width={config.size.w} height={config.size.h} />
      <a ref={aEl} style={{display: "none"}} />
    </div>
  );
};