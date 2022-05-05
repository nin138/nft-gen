import React from "react";
import {Layer} from "../../../data/layer/layer";
import {UsedItemLayer} from "./UsedItemLayer";
import {Paper, styled} from "@mui/material";
import {scrollbarStyle} from "../../Atoms/scrollbarStyle";

type Props = {
  layers: Layer[];
  used: number[][];
  created: number;
}

const Container = styled(Paper)({
  height: 300,
  width: '100%',
  overflowY: "scroll",
  overflowX: "scroll",
  ...scrollbarStyle,
  display: "flex",
  padding: 8,
  border: 'solid #777',
  marginBottom: 16,
  flex: '0 0 300px',
})
export const UsedItemViewer: React.FC<Props> = ({used, layers, created}) => {
  return (
    <Container>
      {layers.map((it, i) => <UsedItemLayer key={it.layerId} layer={it} used={used[i]} created={created} />)}
    </Container>
  );
};