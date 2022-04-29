import {Layer, LayerItem} from "../../data/layer/layer";
import {createItemNum} from "./combine";
import {applyFilters, Filter} from "../../data/Filter";


export type ItemIndexes = number[];

export const getAll = (layers: Layer[], filters: Filter[]): ItemIndexes[] => {
  const ls = layers.filter(it => it.items.length !== 0);
  const result: number[][] = [];

  const rec = (carry: number[], l: number, i: number): void => {
    if(carry.length === ls.length) {
      result.push(carry);
      return;
    }
    if(ls[l].items.length === i) return;
    const d = [...carry, i];
    rec(d, l+1, 0);
    rec(carry, l, i + 1);
  }
  rec([], 0, 0);
  return  applyFilters(result, layers, filters);
};

const restToValue = (rest: number) => rest < 1 ? -500 : rest;

export const pick = (layers: Layer[], _indexes: ItemIndexes[], numberOfToken: number) => {
  if(_indexes.length < numberOfToken) return [];
  const indexes = [..._indexes];
  const rest = createItemNum(layers, numberOfToken);
  const evaluate = (it: ItemIndexes) => { return it.reduce((prev, current, l) => prev + restToValue(rest[l][current]), 0) };

  const result: ItemIndexes[] = [];
  for (let i = 0; i < numberOfToken; i++) {
    const v = indexes.map(evaluate);
    const max = v.reduce((prev, current, i) => prev[1] < current ? [i, current] : prev, [0, 0]);
    const target = indexes[max[0]];
    target.forEach((i, l) => {
      rest[l][i] -= 1;
    })
    indexes.splice(max[0], 1);
    result.push(target)
  }
  // if(!isUnique(result)) throw new Error('????');
  return result;
}

export const countUsed = (layers: Layer[], indexes: ItemIndexes[]) => {
  const result = layers.map(layer => layer.items.map(_ => 0));
  indexes.forEach((items: ItemIndexes) => {
    items.forEach((i, l) => {
      result[l][i] += 1;
    });
  });
  return result;
}


export type ItemWithUsed = {
  item: LayerItem;
  used: number;
};

export const indexToItem = (layers: Layer[], indexes: ItemIndexes[]): LayerItem[][] => {
  return indexes.map((indexes) => {
    return indexes.map((i, l) => (layers[l].items[i]))
  });
}

