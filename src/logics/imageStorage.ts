import {randomUUID} from "crypto";

export type Image = {
  key: string;
  name: string;
  dataUrl: string;
};

export const ImageStorage = {
  save: async (file: File): Promise<Image> => {
    const key = randomUUID();
    const data =  {
      key,
      name: file.name,
      dataUrl: URL.createObjectURL(new Blob([await file.arrayBuffer()])),
    }
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  },
  get(key:string): Image {
    return JSON.parse(localStorage.getItem(key)!);
  },
};
