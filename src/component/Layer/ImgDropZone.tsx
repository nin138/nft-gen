import React, {useCallback} from "react";
import {Layer, LayerId} from "../../data/layer/layer";
import {Box, styled} from "@mui/material";
import {DropzoneOptions, useDropzone} from "react-dropzone";
import {ImageStorage} from "../../logics/imageStorage";
import {LayerActionCreator} from "../../data/layer/layerStore";


type Props = {
  layerId: LayerId
  la: LayerActionCreator
}

const Container = styled('div')({
  height: 100,
  display: "flex",
  alignItems: "center",
  border: "dotted",
  padding: 20,
  borderRadius: 12,
  cursor: "pointer",
  margin: 12,
});

export const ImgDropZone: React.FC<Props> = ({layerId, la}) => {
  const onDrop: DropzoneOptions['onDrop'] = useCallback(async (acceptedFiles: File[]) => {
    for (let file of acceptedFiles) {
      if(!file.type.includes('image')) {
        window.alert(`File not supported. type: ${file.type}`);
        continue;
      }
      la.addLayerItem(layerId, await ImageStorage.save(file));
    }
  }, [layerId, la])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: true})

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Container {...getRootProps()} style={{background: isDragActive ? '#666' : undefined}} >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </Container>
    </Box>
  );
};
