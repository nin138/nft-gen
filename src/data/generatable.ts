import {Layer} from "./layer/layer";

export type Generatable = {
  nftName: string;
  description: string;
  numberOfTokens: number;
  layers: Layer[];
}