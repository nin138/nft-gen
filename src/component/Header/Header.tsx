import React from "react";
import {styled} from "@mui/material";
export const HEADER_HEIGHT = '60px';

const H = styled('header')`
  height: ${HEADER_HEIGHT};
  background: #666;
  box-shadow: 2px 2px 5px #aaaf;
  position: sticky;
`;

export const Header: React.FC = () => {
  return (
    <H>
      <h1>Tempura Generator</h1>
    </H>
  )
};
