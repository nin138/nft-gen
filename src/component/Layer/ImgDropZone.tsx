import React, {CSSProperties, useCallback} from "react";
import {Layer, LayerId} from "../../data/layer/layer";
import {Box, styled} from "@mui/material";
import {DropzoneOptions, useDropzone} from "react-dropzone";
import {ImageStorage} from "../../logics/imageStorage";
import {LayerActionCreator} from "../../data/layer/layerStore";


type Props = {
  layerId: LayerId
  la: LayerActionCreator
}

const v1 = '8px';
const v2 = '12px';
const borderWidth = '3px';
const borderColor = '#1117';
const dotted: CSSProperties = {
  backgroundImage: `
  linear-gradient(to right, ${borderColor}, ${borderColor} ${v1}, transparent ${v1}, transparent ${v2}),
  linear-gradient(to bottom, ${borderColor}, ${borderColor} ${v1}, transparent ${v1}, transparent ${v2}),
  linear-gradient(to left, ${borderColor}, ${borderColor} ${v1}, transparent ${v1}, transparent ${v2}),
  linear-gradient(to top, ${borderColor}, ${borderColor} ${v1}, transparent ${v1}, transparent ${v2})`,
  backgroundPosition: `\
  left top,
  right top,
  right bottom,
  left bottom`,
  backgroundSize: `\
  ${v2} ${borderWidth},
  ${borderWidth} ${v2},
  ${v2} ${borderWidth},
  ${borderWidth} ${v2}`,
  backgroundRepeat: `\
  repeat-x,
  repeat-y,
  repeat-x,
  repeat-y`,
}

const Container = styled('div')({
  height: 40,
  display: "flex",
  alignItems: "center",
  border: "",
  padding: 20,
  borderRadius: 8,
  cursor: "pointer",
  margin: 12,
  ...dotted,
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
