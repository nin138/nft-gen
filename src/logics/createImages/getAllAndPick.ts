import {Layer, LayerItem} from "../../data/layer/layer";
import {createItemRemaining} from "../combine/combine";
import {applyFilters, FilterCompiled} from "../../data/Filter";
import {writeLog} from "../console";
import type {ItemIndexes} from "./types";

export const getAll = (layers: Layer[], filters: FilterCompiled[], fixedIndexes: ItemIndexes[]): ItemIndexes[] => {
  writeLog('getAll st')

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

  const filtered = fixedIndexes
    .map(it => it.toString())
    .reduce((prev, current) => prev.filter(it => it.toString() !== current), result)

  const r = applyFilters(filtered, layers, filters);
  writeLog('getAll ed')
  return r;
};

// todo rest value avg algo

const restToValue = (rest: number) => rest < 1 ? -100 : rest;

export const pick = (layers: Layer[], _indexes: ItemIndexes[], numberOfToken: number) => {
  if(_indexes.length < numberOfToken) return [];
  const indexes = [..._indexes];
  const rest = createItemRemaining(layers, numberOfToken);
  const evaluate = (it: ItemIndexes) => { return it.reduce((prev, current, l) => prev + restToValue(rest[l][current]), 0) };

  const result: ItemIndexes[] = Array(numberOfToken);
  for (let i = 0; i < numberOfToken; i++) {
    if(i % 10 ===0) writeLog('pickloop: ' + i);
    const vs = indexes.map(evaluate);
    // const max = v.reduce((prev, current, i) => prev[1] < current ? [i, current] : prev, [0, 0]);
    let max = vs[0];
    let maxIndex = 0;
    for(let i = 1; i < vs.length; i += 7) {
      if(max < vs[i]) {
        max = vs[i];
        maxIndex = i;
      }
    }

    const target = indexes[maxIndex];
    target.forEach((i, l) => {
      rest[l][i] -= 1;
    })
    indexes.splice(maxIndex, 1);
    result[i] = target;
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

export const getAllAndPick = (layers: Layer[], numberOfTokens: number, filters: FilterCompiled[], fixedIndexes: ItemIndexes[]): ItemIndexes[] => {
  const all = getAll(layers, filters, fixedIndexes);
  const picked = pick(layers, all, numberOfTokens - fixedIndexes.length);
  return [...fixedIndexes, ...picked];
}
