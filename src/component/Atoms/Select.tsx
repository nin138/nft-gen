import React from "react";
import {MenuItem, Select as MuiSelect, styled, TextField, Typography} from "@mui/material";


type Item = {
  label: string;
  value: string;
}

type Props = {
  children: Item[]
  value: string;
  onChange: (value: string) => void;
  label?: string
};

const StyledSelect = styled(TextField)({
  minWidth: 180,
})

export const Select: React.FC<Props> = ({children, onChange, value, label}) => {
  return (
    <StyledSelect
      select
      variant={'outlined'}
      label={label ? <Typography>{label}</Typography> : undefined} value={value} onChange={e => onChange(e.target.value as any)}>
      {children.map((it, i) => <MenuItem key={i} value={it.value}>{it.label}</MenuItem>)}
    </StyledSelect>
  );
}
