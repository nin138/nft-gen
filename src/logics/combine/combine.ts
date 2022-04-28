import {Layer} from "../../data/layer/layer";
import * as Rand from 'seedrandom';

type ItemNum = number[][]; // [layer][item] = num;
type History = number[][][][]; // [layer][item][toLayer][toItem] = count;

const createMap = (layers: Layer[]): History => {
  return layers.map(layer => layer.items.map(_ => layers.map(l => l.items.map(_ => 0))));
}

export const isUnique = (arr: number[][]) => {
  for (let i = 0; i < arr.length; i++){
    for (let j = i + 1; j < arr.length; j++){
      if(arr[i].toString() === arr[j].toString()){
        return false;
      }
    }
  }
  return true;
};

const isExist = (arr: number[][], current: number[]) => {
  const s = current.toString();
  return arr.some(it => it.toString() === s);
}

export const createItemNum = (layers: Layer[], numberOfToken: number): ItemNum => {
  return layers.map(layer => {
    const base = Math.floor(numberOfToken / layer.items.length);
    const mod = numberOfToken % layer.items.length;
    return layer.items.map((_, i) => base + ((i < mod) ? 1 : 0))
  })
}

// @return imageUrl[][]
export const combine = (_layers: Layer[], numberOfItems: number): string[][] => {
  const rand: () => number = (Rand as any)('hoge'); // TODO seed
  const layers = _layers.filter(it => it.items.length !== 0);
  const rest: ItemNum = createItemNum(layers, numberOfItems);
  const history: History = createMap(layers);
  const result: number[][] = [];

  // TODO 評価方式をを決定済みのものと現在の値に変更してみる
  const find = (i: number, current: number[], history: History) => {
    const e = (j: number) => {
      let v = 0;
      for (let k = 0;  k < i; k++) {
        v += history[i][j][k][current[k]];
      }
      return v;
    }
    const items = layers[i].items;
    const evs = items.map((_, j) => e(j))
    const canUse = (i: number, j: number) => {
      if(rest[i][j] === 0) return false;
      if(layers.length === i + 1 && isExist(result, [...current, j])) {
        return false;
      }
      return true;
    }
    let min = 99999;
    let f: number[] = [];
    evs.forEach((it, j) => {
      if(!canUse(i, j)) return;
      if(min > it) {
        min = it;
        f = [j];
        return;
      }
      if(min === it) {
        f.push(j);
      }
    });

    if(f.length > 1) {
      return f.map(j => [j, rest[i][j]]).reduce((p, c) => p[1] > c[1] ? p : c, [0, 0])[0]
    }

    if(f.length === 0) throw new Error('hoge');

    return f[Math.floor(rand() * f.length)];
    //
    // return evs.reduce((prev, current, j) => {
    //    return (canUse(i, j) && prev[1] > current ? [j, current] : prev)
    // }, [0, 99999])[0] // [index, min]
  };
  const rec = (i: number, current: number[], history: History): number[] => {
    if(i === layers.length) return current;
    const target = find(i, current, history);
    for (let p = 0; p < i; p++) {
      history[i][target][p][current[p]] += 1;
    }
    rest[i][target] -= 1;
    return rec(i + 1, [...current, target], history);
  };

  // create firstLayer
  const firstLayers = rest[0].flatMap((rest, j) => new Array(rest).fill([j]))
  const toUrl = (i: number, l: number) => layers[l].items[i].image.dataUrl;

  for (let l of firstLayers) {
    result.push(rec(1, l, history))
  }

  if(!isUnique(result)) {
    throw new Error('pls add more item');
  }

  return result.map((items) => items.map(toUrl));
};

