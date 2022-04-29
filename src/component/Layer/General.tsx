import React from "react";
import {styled, TextField} from "@mui/material";
import {Config} from "../../data/configStore";
import {Layer} from "../../data/layer/layer";

type Props = {
  config: Config
  setConfig: (conf: Config) => void;
  generatable: number;
}

const Container = styled('section')({
  margin: 16,
});

export const GeneralEditor: React.FC<Props> = ({config, setConfig, generatable}) => {
  return (
    <Container>
      <TextField
        required
        label="NFT Name"
        value={config.name}
        onChange={(e) => setConfig({...config, name: e.target.value})}
      />
      <TextField type={'number'} label={'width'} value={config.size.w} onChange={e => setConfig({...config, size: { w: +e.target.value, h: config.size.h }})} />
      <TextField type={'number'} label={'height'} value={config.size.h} onChange={e => setConfig({...config, size: { w: config.size.w, h: +e.target.value }})} />
      <br />
      <TextField type={'number'} label={'number of token'} value={config.numberOfToken} onChange={e => setConfig({...config, numberOfToken: +e.target.value})} />
      Generatable number: {generatable}
    </Container>
  );
}