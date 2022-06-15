import {Layer} from "../../data/layer/layer";
import {getAllAndPick} from "./getAllAndPick";
import {ItemIndexes} from "./types";
import {writeLog} from "../console";
import {FilterCompiled} from "../../component/Filter/filterTypes";
import {shuffle} from "../shuffleArray";

export const createImageData = (layers: Layer[], numberOfTokens: number, filters: FilterCompiled[], fixed: ItemIndexes[]) => {
  console.log('fixed', fixed);
  const expect = layers.reduce((prev, current) => prev * current.items.length, 1);
  console.log(expect, numberOfTokens);
  // if(expect * 0.4 > numberOfTokens || expect > 500000) {
  //   writeLog('using combine');
  //   return createByCombine(layers, numberOfTokens, filters, fixed);
  // }
  writeLog('using all and pick');
  return shuffle(getAllAndPick(layers, numberOfTokens, filters, fixed));
}
