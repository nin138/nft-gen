import React, {useCallback, useMemo, useState} from "react";
import {Paper, styled} from "@mui/material";
import {Layer, LayerId, LayerItemId} from "../../data/layer/layer";
import {LayerActionCreator} from "../../data/layer/layerStore";
import {Config} from "../../data/configStore";
import {scrollbarStyle} from "../Atoms/scrollbarStyle";
import {createImageSet} from "../../logics/createImageSet";
import {PreviewCanvas} from "./PreviewCanvas";

type Props = {
  open: boolean;
  config: Config
  layers: Layer[]
}

const Container = styled('section')({
  width: '94vw',
  height: '94vh',
  margin: "auto",
  background: '#333',
  boxShadow: '0 0 10px #fff7',
  transition: 'all 200ms ease-in-out',
  position: 'fixed',
  top: 0,
  left: '3vw',
  borderRadius: '5px',
  zIndex: 100,
  overflowY: "scroll",
  overflowX: "hidden",
  ...scrollbarStyle,
  flexWrap: 'wrap',
  display: 'flex',
  alignItems: 'flex-start'
});

const width = 'calc(20% - 32px)';
const ItemContainer = styled(Paper)({
  flex: `0 0 ${width}`,
  margin: 16,
  padding: 16,
  height: 'fit-content',
});

export const Preview: React.FC<Props> = ({open, config, layers,}) => {
  const items = useMemo(() => createImageSet(layers), [layers]);
  return (
    <Container style={{transform: !open ? 'translateY(105vh)': 'translateY(6vh)' }}>
      {items.map((it, i) => (
        <ItemContainer elevation={4}>
          <PreviewCanvas key={i} size={config.size} images={it} />
          {config.name} #{i}
        </ItemContainer>)
      )}
    </Container>
  );
};