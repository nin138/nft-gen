import {Config} from "../../data/configStore";
import {Layer} from "../../data/layer/layer";
import {Filter} from "../../data/Filter";
import {FixedImage} from "../../data/fixedItems";
import {ImageStorage} from "../imageStorage";

export type IOImage = {
  key: string;
  name: string;
  data: string; // base64
}
export type Project = {
  config: Config,
  layers: Layer[],
  filters: Filter[],
  fixed: FixedImage[],
  images: IOImage[]
}

export const exportPrj = async (config: Config, layers: Layer[], filters: Filter[], fixed: FixedImage[]): Promise<string> => {
  const images = await Promise.all(layers.flatMap(
    l => l.items.map(async it =>
      ({
        key: it.image.key,
        name: it.image.name,
        data: Buffer.from(await (await ImageStorage.getBlob(it.image.key)).arrayBuffer()).toString('base64'),
      }))
  ));
  const prj: Project = {
    config,
    layers,
    filters,
    fixed,
    images: await Promise.all(images),
  }
  return JSON.stringify(prj);
};


export const importPrj = async (json: string): Promise<Project> => {
  const prj: Project = JSON.parse(json);
  await Promise.all(prj.images.map(it => ImageStorage.inputLoadedData(it.key, it.name, new Blob([Buffer.from(it.data, 'base64')]))));
  return prj;
};
