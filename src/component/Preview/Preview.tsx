import React, {useMemo, useRef} from "react";
import {Paper, styled} from "@mui/material";
import {Layer} from "../../data/layer/layer";
import {Config, Size} from "../../data/configStore";
import {scrollbarStyle} from "../Atoms/scrollbarStyle";
import {PreviewCanvas} from "./PreviewCanvas";
import {useElementRect} from "../useElementRect";
import {FixedSizeList, ListChildComponentProps} from 'react-window';
import {getPicked, indexToItem, ItemIndexes} from "../../logics/combine/getAll";
type Props = {
  open: boolean;
  config: Config
  layers: Layer[]
  items: ItemIndexes[]
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

const SCROLL_BAR_WIDTH = 7.5;
const margin = 8;
const padding = 16;
const COLUMN_NUM = 5;
const FOOTER_HEIGHT = 20;
const width = `calc(20% - ${margin * 2}px)`;
const ItemContainer = styled(Paper)({
  flex: `0 0 ${width}`,
  margin: '0px 8px',
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


const calcLineHeight = (containerW: number, size: Size) => {
  const imageW = (containerW - SCROLL_BAR_WIDTH) / COLUMN_NUM - padding * 2 - margin * 2;
  return imageW * size.h / size.w + padding * 2 + FOOTER_HEIGHT + margin + 4;
}

const CanvasFooter = styled('div')({
  height: FOOTER_HEIGHT,
});
export const Preview: React.FC<Props> = ({open, config, layers, items}) => {

  const lines = useMemo(() => {
    return sliceArray(indexToItem(layers, items), COLUMN_NUM);
  }, [items]);
  const ref = useRef(null);
  const rect = useElementRect(ref);
  const lineHeight = calcLineHeight(rect?.width || 0, config.size);

  const listHeight = (rect?.height || 500) - 200;
  const Row = ({index, style}: ListChildComponentProps) => (
    <Line key={index} style={style}>
      {lines[index].map((item, j) => (
        <ItemContainer key={`${index}_${j}`} elevation={4}>
          <PreviewCanvas size={config.size} items={item} />
          <CanvasFooter>{config.name} #{index * COLUMN_NUM + j + 1}</CanvasFooter>
        </ItemContainer>
      ))}
    </Line>
  );

  return (
    <Container style={{transform: !open ? 'translateY(105vh)': 'translateY(6vh)' }} ref={ref}>
      {lines.length === 0 && 'Please add more Items'}
      <List itemSize={lineHeight} height={listHeight} itemCount={lines.length} width={'100%'}>
        {Row}
      </List>
    </Container>
  );
};