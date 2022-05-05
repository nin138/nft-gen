import {Layer} from "../../data/layer/layer";
import {FilterCompiled} from "../../data/Filter";
import {createByCombine} from "./createByCombine";
import {getAllAndPick} from "./getAllAndPick";
import {ItemIndexes} from "./types";
import {writeLog} from "../console";

export const createImageData = (layers: Layer[], numberOfTokens: number, filters: FilterCompiled[], fixed: ItemIndexes[]) => {
  console.log('fixed', fixed);
  const expect = layers.reduce((prev, current) => prev * current.items.length, 1);
  console.log(expect, numberOfTokens);
  if(expect * 0.4 > numberOfTokens || expect > 500000) {
    writeLog('using combine');
    return createByCombine(layers, numberOfTokens, filters, fixed);
  }
  return getAllAndPick(layers, numberOfTokens, filters, fixed);
}
