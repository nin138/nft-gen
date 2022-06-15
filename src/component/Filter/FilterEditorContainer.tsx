import React from "react";
import {Button, Paper, styled} from "@mui/material";
import {DeleteIcon} from "../Icons";
import {Filter} from "./filterTypes";
import {FilterTypeSelector} from "./FilterTypeSelector";

const Container = styled(Paper)({
  display: 'flex',
  padding: 12,
  margin: '24px 0',
  justifyContent: "space-between",
});

const DelButton = styled(Button)({
  width: 50,
  height: 65,
  border: "solid",
  borderRadius: '50%',
  justifySelf: 'flex-end',
})

type Props = {
  filter: Filter
  remove: () => void;
  isValid: boolean;
  updateFilter: (filter: Filter) => void;
  children: React.ReactNode;
}
export const FilterEditorContainer: React.FC<Props> = ({filter, remove, updateFilter, isValid, children}) => {
  return (
    <Container elevation={4} style={{background: isValid ? undefined : '#a00'}}>
      <div>
        <FilterTypeSelector onChange={(v) => updateFilter({...filter, type: v as any})} value={filter.type} />
        { isValid ? '' : '(INVALID)' }
        {children}
      </div>
      <DelButton variant={"outlined"} onClick={remove}><DeleteIcon/></DelButton>
    </Container>
  );
}
