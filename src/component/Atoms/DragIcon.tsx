import React from "react";
import { Paper, styled} from "@mui/material";
import {theme} from "../../theme";

export const DragIconWrap = styled(Paper)({
  border: "1px solid",
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  background: '#222',
  color: theme.palette.primary.main,
  position: "relative",
});
