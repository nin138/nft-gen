import React from "react";
import {styled, TextField} from "@mui/material";
import {Config} from "../../data/configStore";

type Props = {
  config: Config
  setConfig: (conf: Config) => void;
}

const Container = styled('section')({
  margin: 16,
});

export const GeneralEditor: React.FC<Props> = ({config, setConfig}) => {
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
    </Container>
  );
}