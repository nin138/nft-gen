import {MetadataInfo} from "./metadataStore";
import {ItemIndexes} from "../logics/createImages/types";
import {Layer} from "../data/layer/layer";

export type NFTMetaData = {
  image: string; // url
  description: string; // md supported
  name: string;
  attributes?: NFTAttribute[];
}
// While we advise against storing metadata on chain, if you decide that it's important for your use case, contact us at support@opensea.io and we'll get back to you with questions and next steps.


type DisplayType = 'number' | 'date' | 'boost_number' | 'boost_percentage';

export type NFTAttribute = {
  display_type?: DisplayType;
  trait_type: string;
  value: string;
}

const createAttribute = (indexes: ItemIndexes, layers: Layer[]): NFTAttribute[] => {
  return layers.map((it, i) => ({
    trait_type: it.name,
    value: it.items[i].name,
  }));
};

export const createMetadata = (nftName: string, info: MetadataInfo, i: number, layers: Layer[], indexes: ItemIndexes): NFTMetaData => ({
  image: `${info.imageBaseUrl}/${i + 1}.png`,
  description: info.description,
  name: `${nftName} #${i+1}`,
  attributes: createAttribute(indexes, layers),
});
