import React from "react";
import {Layer, LayerId} from "../../data/layer/layer";
import {Button, Paper, styled, TextField} from "@mui/material";
import {LayerListItem} from "./LayerListItem";
import {HEADER_HEIGHT} from "../Header/Header";
import {LayerActionCreator} from "../../data/layer/layerStore";
import {GENERAL_ID} from "../Main";
import './LayerList.css';

const Wrap = styled('div')`
  flex: 0 0 300px;
  height: calc(100vh - ${HEADER_HEIGHT});
  background : #323232;
  boxShadow: '-3px 0 2px #777f inset',
`;

const Title = styled('div')({
  marginTop: 2,
  padding: 16,
  height: 72,
  display: 'flex',
  alignItems: 'center',
  justifyContent:"center",
  cursor: "pointer",
  ":hover": {
    background: '#fff5',
  },
});

const ScrollContainer = styled('div')`
overflow-y: scroll;
overflow-x: revert;
scrollbar-width: none;
&::-webkit-scrollbar {
  display:none;
};
height: calc(100vh - ${HEADER_HEIGHT});
box-shadow: -3px -2px 2px #777f inset;
`;

const ButtonWrap = styled('div')`
`;

type Props = {
  layers: Layer[]
  selectedId: LayerId;
  la: LayerActionCreator;
  setSelectedLayer: (id: LayerId) => void;
}

export const LayerList: React.FC<Props> = ({layers,selectedId, la, setSelectedLayer}) => {
  return (
    <Wrap>
      <ScrollContainer>
        <Title className={selectedId === GENERAL_ID ? 'selectedItem' : undefined} onClick={() => setSelectedLayer(GENERAL_ID)}>General</Title>
        {layers.map(it => <LayerListItem key={it.layerId} layer={it} selected={selectedId === it.layerId} onClick={setSelectedLayer} updateLayer={la.updateLayer} />)}
        <ButtonWrap>
          <Button style={{margin: 16}} variant={'outlined'} onClick={la.addLayer}>Add Layer</Button>
        </ButtonWrap>
      </ScrollContainer>
    </Wrap>
  );
};
