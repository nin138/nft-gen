import {nanoid} from "nanoid";
import Dexie from 'dexie';

export type Image = {
  key: string;
  name: string;
  dataUrl: string;
};

type ImageRecord = {
  key: string
  name: string;
  blob: Blob
}


class ImageDB extends Dexie {
  readonly DB_VERSION = 1;
  public image!: Dexie.Table<ImageRecord, string>
  public constructor() {
    super('ImgStore');
    this.version(this.DB_VERSION).stores({
      image: 'key, name, blob'
    });
  }
}
const db = new ImageDB();


export const ImageStorage = {
  save: async (file: File): Promise<Image> => {
    const key = nanoid();
    const blob = new Blob([await file.arrayBuffer()]);

    db.image.put({
      key,
      name: file.name,
      blob,
    })

    return {
      key,
      name: file.name,
      dataUrl: URL.createObjectURL(blob),
    };
  },
  restore: async (key:string): Promise<Image> => {
    const record = await db.image.get(key);
    if(!record) throw new Error('fail to load image');
    return {
      key,
      name: record.name,
      dataUrl: URL.createObjectURL(record.blob),
    }
  },
};
