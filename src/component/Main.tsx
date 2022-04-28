import React, {useMemo, useState} from "react";
import {useLayers} from "../data/layer/layerStore";
import {Editor} from "./Editor/Editor";
import {Fab, Modal, styled} from "@mui/material";
import {PreviewIcon} from "./Icons";
import {useConfig} from "../data/configStore";
import {GeneralEditor} from "./Layer/General";
import {Preview} from "./Preview/Preview";
import {countUsed, getPicked, indexToItem} from "../logics/combine/getAll";

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

const PreviewButton = styled(Fab)({
  pointerEvents: 'all',
});

export const Main: React.FC = () => {
  const {config, setConfig} = useConfig();
  const {loading, la, layers} = useLayers();
  const [preview, setPreview] = useState(false);
  const picked = useMemo(() => getPicked(layers, config.numberOfToken), [layers, config]);
  const used = useMemo(() => countUsed(layers, picked), [layers, picked]);
  if (loading) return <p>Loading...</p>

  return (
    <div>
      <GeneralEditor config={config} setConfig={setConfig} layers={layers} />
      <Editor layers={layers} la={la} usedCount={used} />
      <FloatingButtonArea>
        <PreviewButton color={"primary"} variant="extended" onClick={() => setPreview(!preview)}>
          <PreviewIcon sx={{ mr: 1 }} />
          Preview
        </PreviewButton>
      </FloatingButtonArea>

      <Preview open={preview} config={config} layers={layers} items={picked} />
    </div>
  );
};