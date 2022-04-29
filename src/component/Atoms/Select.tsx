import React from "react";
import {MenuItem, Select as MuiSelect, styled} from "@mui/material";


type Item = {
  label: string;
  value: string;
}

type Props = {
  children: Item[]
  value: string;
  onChange: (value: string) => void;
};

const StyledSelect = styled(MuiSelect)({
  minWidth: 180,
})

export const Select: React.FC<Props> = ({children, onChange, value}) => {
  return (
    <StyledSelect value={value} onChange={e => onChange(e.target.value as any)}>
      {children.map((it, i) => <MenuItem key={i} value={it.value}>{it.label}</MenuItem>)}
    </StyledSelect>
  );
}
