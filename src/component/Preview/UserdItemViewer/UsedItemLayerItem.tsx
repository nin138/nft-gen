import React from "react";
import { LayerItem} from "../../../data/layer/layer";
import {styled} from "@mui/material";

type Props = {
  item: LayerItem;
  used: number;
  created: number;
}

const Container = styled('div')({
  textAlign: 'right',
  display: 'flex',
})

const Item = styled('div')({
  flex: '1',
  padding: 8,
})

export const UsedItemLayerItem: React.FC<Props> = ({used, item, created}) => {
  return (
    <Container>
      <Item>{item.name}</Item>
      <Item>{used}/{created}</Item>
      <Item>({(used / created * 100).toFixed(2)}%)</Item>
    </Container>
  );
};
