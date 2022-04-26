export type NFTMetaData = {
  image: string; // url
  description: string; // md supported
  name: string;
  attributes?: Attribute[];
}
// While we advise against storing metadata on chain, if you decide that it's important for your use case, contact us at support@opensea.io and we'll get back to you with questions and next steps.


type DisplayType = 'number' | 'date' | 'boost_number' | 'boost_percentage';

type Attribute = {
  display_type?: DisplayType;
  trait_type: string;
  value: string;
}
