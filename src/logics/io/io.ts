import {Config, restoreConfig} from "../../data/configStore";
import {Layer} from "../../data/layer/layer";
import {FixedImage} from "../../data/fixedItems";
import {ImageStorage} from "../imageStorage";
import {createZip} from "../images/toZip";
import Zip from 'jszip';
import {MetadataInfo} from "../../nft/metadataStore";
import {Filter} from "../../component/Filter/filterTypes";
import {replaceFilterTypeName} from "../../data/filterStore";

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

  // for backward compatibility
  const parsePrj = (json: string): Project => {
    const prj: Project = JSON.parse(json);
    return { ...prj, filters: prj.filters.map(replaceFilterTypeName), config: restoreConfig(prj.config) }
  }

  const prj = parsePrj(json);

  await Promise.all(
    Object.values(zip.files).map(async (file) => {
    if(file.name === PRJ_FILENAME) {return;}
    return ImageStorage.inputLoadedData(file.name, prj.images.find(it => it.key === file.name)?.name!, await file.async("blob"))
  }));
  return prj;
};
