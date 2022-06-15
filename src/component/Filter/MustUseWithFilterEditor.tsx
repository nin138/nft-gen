import React from "react";
import {Select} from "../Atoms/Select";
import {FilterTypes} from "./filterTypes";

const maps = Object.entries(FilterTypes).map(([key, value]) => ({
  label: key,
  value,
}));

type Props = {
  onChange: () => void
  value: string
};

export const FilterTypeSelector: React.FC<Props> = ({value, onChange}) => {
  return (
    <Select value={value} onChange={onChange}>
      {maps}
    </Select>
  );
};
