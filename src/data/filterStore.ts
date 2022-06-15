import {useEffect, useMemo, useState} from "react";
import {Filter, FilterTypes} from "../component/Filter/filterTypes";

export const replaceFilterTypeName = (filter: Filter): Filter => {
  // @ts-ignore
  if(filter.type === 'UseWith') {
    return {...(filter as any), type: FilterTypes.MustNotUseWith} as Filter;
  }
  return filter;
};


const KEY = '_FILTER_'
const FilterStorage = {
  save: (filters: Filter[]) => localStorage.setItem(KEY, JSON.stringify(filters)),
  restore: (): Filter[] => {
    const data = localStorage.getItem(KEY)
    if(!data) return [];

    return JSON.parse(data).map(replaceFilterTypeName);
  }
}

export type FilterState = {
  filters: Filter[];
  updateFilter: (index: number, filter: Filter) => void;
  addFilter: (filter: Filter) => void;
  removeFilter: (index: number) => void;
  reinitFilter: (filters: Filter[]) => void;
}

export const useFilter = (): FilterState => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const updateFilter = (index: number, filter: Filter) => setFilters(filters => filters.map((it,i) => i === index ? filter : it));
  const addFilter = (filter: Filter) => {
    setFilters((filters) => [...filters, filter]);
  }
  const removeFilter = (index: number) => setFilters(filters => filters.filter((_, i) => i !== index));
  useEffect(() => {
    const data = FilterStorage.restore();
    if(data) setFilters(data);

    const cb = () => setFilters(c => {
      FilterStorage.save(c);
      return c;
    })
    window.addEventListener("beforeunload", cb);
    return () => window.removeEventListener("beforeunload", cb);
  }, []);
  const reinitFilter = (filters: Filter[]) => setFilters(filters);

  return useMemo(() => ({
    filters,
    updateFilter,
    addFilter,
    removeFilter,
    reinitFilter,
  }), [filters,]);
}
