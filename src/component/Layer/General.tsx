import React from "react";
import {TextField} from "@mui/material";

type Props = {

}

export const GeneralEditor: React.FC<Props> = ({}) => {
  return (
    <TextField
      required
      label="NFT Name"
    />
  );
}