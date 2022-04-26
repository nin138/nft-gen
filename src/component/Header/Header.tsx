import React from "react";
import {Box, Paper, styled} from "@mui/material";
import {theme} from "../../theme";


export const HEADER_HEIGHT = '60px';

const H = styled('header')`
  height: ${HEADER_HEIGHT};
  background: ${theme.palette.primary.main};
  box-shadow: 2px 2px 5px #aaaf;
  position: sticky;
`;

export const Header: React.FC = () => {
  return (
    <H>
      <h1>App</h1>
    </H>
  )
};
