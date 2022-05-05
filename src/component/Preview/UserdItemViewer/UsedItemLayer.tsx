import React from "react";
import {Layer} from "../../../data/layer/layer";
import {UsedItemLayerItem} from "./UsedItemLayerItem";
import {Paper, styled} from "@mui/material";

type Props = {
  layer: Layer;
  used: number[];
  created: number;
}

const Container = styled(Paper)({
  padding: 8,
  margin: 8,
  height: 'fit-content',
})


export const UsedItemLayer: React.FC<Props> = ({used, layer, created}) => {
  return (
    <Container elevation={4}>
      {layer.name}
      {layer.items.map((it, i) => <UsedItemLayerItem key={it.itemId} item={it} used={used[i]} created={created} />)}
    </Container>
  );
};
