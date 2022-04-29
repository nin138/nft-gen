export type Metadata = {
  name: string; // "Foo #1",
  description: string;
  image: string // ipfs://QmSQ2
  edition: number;
  attributes: MetadataAttribute,
  compile: 'Tempura'
}

export type MetadataAttribute = {
  trait_type: string
  value: string
}
