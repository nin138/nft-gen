import {Layer} from "../../data/layer/layer";
import {createItemRemaining} from "../combine/combine";
import {writeLog} from "../console";
import { FilterCompiled, isFiltered} from "../../data/Filter";
import * as Rand from 'seedrandom';
import {ItemIndexes} from "./types";

export const createByCombine = (layers: Layer[], numberOfTokens: number, filters: FilterCompiled[], fixed: ItemIndexes[]) => {
  const rand: () => number = (Rand as any)('hoge'); // TODO seed
  const results: ItemIndexes[] = Array(numberOfTokens);
  const layerRemains = createItemRemaining(layers, numberOfTokens);
  fixed.forEach((f, i) => {
    results[i] = f
    f.forEach((i, l) => layerRemains[l][i] -= 1);
  });

  for (let i = 0; i < numberOfTokens; i++) {
    const r = find(layers, layerRemains, results, filters);
    if(r === null) {
      writeLog(layerRemains)
      console.log('results', results)
      throw new Error(`failed at ${i}`);
    }
    results[i] = r;
    r.forEach((i, l) => layerRemains[l][i] -= 1);
  }

  const fixLen = fixed.length;
  const sliced = results.slice(fixLen);
  sliced.sort(() => rand() - 0.5);
  return [...fixed, ...sliced];
}


const eq = (a: ItemIndexes, b: ItemIndexes) => {
  for (let i = 0; i < a.length; i ++) {
    if(a[i] !== b[i]) return false;
  }
  return true
}

const include = (items: ItemIndexes[], newItem: ItemIndexes) => {
  for (let item of items) {
    if(!item) return false;
    if(eq(item, newItem)) {
      return true;
    }
  }
  return false;
}

const find = (layers: Layer[], layerRemains: number[][], result: number[][], filters: FilterCompiled[]): number[] | null => {
  let data: number[][]  = Array(layers.length);
  let i = 0;
  for (let remains of layerRemains) {
    const indexes: number[] = [];
    const max = remains.reduce((prev, current) => prev > current ? prev : current);

    for (let j = 0; j < remains.length; j++) {
      if(remains[j] >= max) {
        indexes.push(j);
      }
    }
    data[i] = indexes;
    i++;
  }
  const len = layers.length;
  const dfs = (carry: number[], l: number): number[] | null => {
    if(carry.length === len) {
      return include(result, carry) || isFiltered(carry, filters) ? null : carry;
    }
    for (let i = 0; i < data[l].length; i++) {
      carry.push(data[l][i]);
      const r = dfs(carry, l + 1);
      if(r !== null) return r;
      carry.pop();
    }
    return null;
  }
  return dfs([], 0);
}
