import React from "react";
import {Select} from "../Atoms/Select";
import {FilterTypes} from "./filterTypes";

const maps = Object.entries(FilterTypes).filter(it => it[0] !== FilterTypes.Noop).map(([key, value]) => ({
  label: key,
  value,
}));

type Props = {
  onChange: (value: string) => void
  value: string
};

export const FilterTypeSelector: React.FC<Props> = ({value, onChange}) => {
  return (
    <Select value={value} onChange={onChange}>
      {maps}
    </Select>
  );
};
