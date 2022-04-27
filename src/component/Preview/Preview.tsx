import React, {useCallback, useMemo, useRef, useState} from "react";
import {Paper, styled} from "@mui/material";
import {Layer, LayerId, LayerItemId} from "../../data/layer/layer";
import {LayerActionCreator} from "../../data/layer/layerStore";
import {Config, Size} from "../../data/configStore";
import {scrollbarStyle} from "../Atoms/scrollbarStyle";
import {createImageSet} from "../../logics/createImageSet";
import {PreviewCanvas} from "./PreviewCanvas";
import {useElementRect} from "../useElementRect";
import {FixedSizeList, ListChildComponentProps} from 'react-window';
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
  flexWrap: 'wrap',
  display: 'flex',
  alignItems: 'flex-start'
});

const List = styled(FixedSizeList)({
  height: '90vh',
  overflowY: "scroll",
  overflowX: "hidden",
  ...scrollbarStyle,
});

const width = 'calc(20% - 32px)';
const ItemContainer = styled(Paper)({
  flex: `0 0 ${width}`,
  margin: 16,
  padding: 16,
  height: 'fit-content',
});

const Line = styled('div')({
  display: 'flex',
  width: '100%',
});

const sliceArray = <T extends unknown>(arr: T[], num: number): T[][]  => {
  const len = Math.ceil(arr.length / num);
  return [...Array(len).keys()].map(i => arr.slice(i* num, i * num + num));
}

const SCROLL_BAR_WIDTH = 7.5;
const margin = 16;
const padding = 16;
const COLUMN_NUM = 5;
const FOOTER_HEIGHT = 20;
const calcLineHeight = (containerW: number, size: Size) => {
  const imageW = (containerW - SCROLL_BAR_WIDTH) / COLUMN_NUM - padding * 2 - margin * 2;
  return imageW * size.h / size.w + padding * 2 + FOOTER_HEIGHT + margin;
}

const CanvasFooter = styled('div')({
  height: FOOTER_HEIGHT,
});
export const Preview: React.FC<Props> = ({open, config, layers,}) => {
  const lines = useMemo(() => sliceArray(createImageSet(layers), COLUMN_NUM), [layers]);
  const ref =useRef(null);
  const rect = useElementRect(ref);
  const lineHeight = calcLineHeight(rect?.width || 0, config.size);

  const listHeight = (rect?.height || 500) - 200;
  const Row = ({index, style}: ListChildComponentProps) => (
    <Line key={index} style={style}>
      {lines[index].map((image, j) => (
        <ItemContainer key={`${index}_${j}`} elevation={4}>
          <PreviewCanvas size={config.size} images={image} />
          <CanvasFooter>{config.name} #{index * COLUMN_NUM + j}</CanvasFooter>
        </ItemContainer>
      ))}
    </Line>
  );

  return (
    <Container style={{transform: !open ? 'translateY(105vh)': 'translateY(6vh)' }} ref={ref}>
      <List itemSize={lineHeight} height={listHeight} itemCount={lines.length} width={'100%'}>
        {Row}
      </List>
    </Container>
  );
};