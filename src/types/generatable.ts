import {Layer} from "./layer";

export type Generatable = {
  prjName: string;
  numberOfTokens: number;
  layers: Layer[];
}