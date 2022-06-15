import React from "react";
import {styled, TextField} from "@mui/material";
import {AlgorithmTypes, Config} from "../../data/configStore";
import {MetadataInfo} from "../../nft/metadataStore";
import {Select} from "../Atoms/Select";

type Props = {
  config: Config
  setConfig: (conf: Config) => void;
  info: MetadataInfo;
  setInfo: (info: MetadataInfo) => void;

}

const Container = styled('section')({
  margin: 16,
});

const algoSelectItems = Object.entries(AlgorithmTypes).map(([label, value]) => ({
  label,
  value
}));

export const GeneralEditor: React.FC<Props> = ({config, setConfig, info, setInfo}) => {
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
      <TextField type={'number'} label={'number of token'} value={config.numberOfToken} onChange={e => setConfig({...config, numberOfToken: +e.target.value})} />
      <TextField type={'text'} label={'nft description'} value={info.description} onChange={e => setInfo({...info, description: e.target.value})} multiline />
      <TextField type={'text'} label={'baseUrl of image'} value={info.imageBaseUrl} onChange={e => setInfo({...info, imageBaseUrl: e.target.value})} />
      <Select label={'algorithm'} value={config.algorithm} onChange={v => setConfig({...config, algorithm: v as keyof typeof AlgorithmTypes})}>
        {algoSelectItems}
      </Select>
    </Container>
  );
}
