import {Layer} from "../data/layer/layer";
import {Image} from "./imageStorage";

export const createImageSet = (layers: Layer[]) => {
  const ls = layers.filter(it => it.items.length !== 0);
  const result: Image[][] = [];

  const rec = (carry: Image[], l: number, i: number): void => {
    if(carry.length === ls.length) {
      result.push(carry);
      return;
    }
    if(ls[l].items.length === i) return;
    const d = [...carry, ls[l].items[i].image];
    rec(d, l+1, 0);
    rec(carry, l, i + 1);
  }
  rec([], 0, 0);
  return result;
};