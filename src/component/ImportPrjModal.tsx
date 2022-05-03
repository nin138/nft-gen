import React, {useCallback} from "react";
import {Modal, Paper, styled} from "@mui/material";
import {DropzoneOptions, useDropzone} from "react-dropzone";
import {borderDotted} from "./Layer/ImgDropZone";

interface Props {
  open: boolean;
  onImport: (zip: File) => void;
  close: () => void;
}

const Container = styled(Paper)({
  width: '500px',
  height: 300,
  margin: '20vh auto',
  padding: 24,
});

const Drop = styled('div')({
  width: '100 %',
  height: 252,
  ...borderDotted,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const ImportPrjModal: React.FC<Props> = ({open, onImport, close}) => {
  const onDrop: DropzoneOptions['onDrop'] = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file.type.includes('zip')) {
      window.alert(`File not supported. type: ${file.type}`);
      return;
    }
    onImport(file);
    close();
  }, [close, onImport])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false})
  return (
    <Modal open={open} onClose={close}>
      <Container elevation={4}>
        <Drop {...getRootProps()} style={{background: isDragActive ? '#666' : undefined}}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop TempuraGen File here, or click to select files</p>
        </Drop>
      </Container>
    </Modal>
  );
}