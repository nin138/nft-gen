import React, {useState} from "react";
import {useLayers} from "../data/layer/layerStore";
import {Editor} from "./Editor/Editor";
import {Fab, Modal, styled} from "@mui/material";
import {PreviewIcon} from "./Icons";
import {useConfig} from "../data/configStore";
import {GeneralEditor} from "./Layer/General";
import {Preview} from "./Preview/Preview";

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
  if (loading) return <p>Loading...</p>

  return (
    <div>
      <GeneralEditor config={config} setConfig={setConfig} />
      <Editor layers={layers} la={la} />
      <FloatingButtonArea>
        <PreviewButton color={"primary"} variant="extended" onClick={() => setPreview(!preview)}>
          <PreviewIcon sx={{ mr: 1 }} />
          Preview
        </PreviewButton>
      </FloatingButtonArea>

      <Preview open={preview} config={config} layers={layers} />
    </div>
  );
};