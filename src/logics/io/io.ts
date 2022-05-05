import {Config} from "../../data/configStore";
import {Layer} from "../../data/layer/layer";
import {Filter} from "../../data/Filter";
import {FixedImage} from "../../data/fixedItems";
import {ImageStorage} from "../imageStorage";
import {createZip} from "../images/toZip";
import Zip from 'jszip';
import {MetadataInfo} from "../../nft/metadataStore";

export type IOImageDATA = {
  key: string;
  name: string;
}
export type Project = {
  config: Config,
  meta: MetadataInfo,
  layers: Layer[],
  filters: Filter[],
  fixed: FixedImage[],
  images: IOImageDATA[],
}
const PRJ_FILENAME = '__PRJ.json';

const getExt = (name: string) => name.split('.').pop();

export const exportPrj = async (config: Config, layers: Layer[], filters: Filter[], fixed: FixedImage[], meta: MetadataInfo): Promise<Blob> => {
  const prj: Project = {
    config,
    meta,
    layers,
    filters,
    fixed,
    images: layers.flatMap(l => l.items.map(item => ({ key: item.image.key, name: item.image.name })))
  }
  const zip = createZip();
  zip.addFile(PRJ_FILENAME, new Blob([JSON.stringify(prj)]));

  await Promise.all(layers.flatMap(
    l => l.items.map(async it => {
      const blob = await ImageStorage.getBlob(it.image.key);
      zip.addFile(it.image.key, blob);
    })
  ));
  return zip.create();
};


export const importPrj = async (file: File): Promise<Project> => {
  const zip = await new Zip().loadAsync(file);
  const json = await zip.file(PRJ_FILENAME)?.async("string");
  if(!json) throw new Error('invalid prj file');
  const prj: Project = JSON.parse(json);

  await Promise.all(
    Object.values(zip.files).map(async (file) => {
    if(file.name === PRJ_FILENAME) {return;}
    return ImageStorage.inputLoadedData(file.name, prj.images.find(it => it.key === file.name)?.name!, await file.async("blob"))
  })
  );
  return prj;
};
