import React from "react";
import {styled} from "@mui/material";
import {Droppable} from "react-beautiful-dnd";
import {Layer} from "../../data/layer/layer";
import {LayerActionCreator} from "../../data/layer/layerStore";
import {LayerEditor} from "../Layer/Layer";
import {AddLayer} from "../LayerList/AddLayer";
import {SectionTitle} from "../Atoms/SectionTitle";

const LayerList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '90vw',
  margin: 'auto',
});

const Section = styled('section')({
  marginBottom: 120,
})

type Props = {
  layers: Layer[]
  la: LayerActionCreator;
}

export const Editor: React.FC<Props> = ({layers, la}) => {
  return (
    <Section>
      <SectionTitle>Layers</SectionTitle>
      <div style={{display: 'flex'}}>
        <Droppable droppableId={'Layer'} type={'Layer'}>
          {(drop) => (
            <LayerList ref={drop.innerRef} {...drop.droppableProps}>
              {layers.map((it, i) => (
                <LayerEditor key={it.layerId} layer={it} la={la} index={i}/>))}
              <AddLayer la={la}/>
              {drop.placeholder}
            </LayerList>
          )}
        </Droppable>
      </div>
    </Section>
  );
};