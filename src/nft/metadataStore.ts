import {useEffect, useState} from "react";

export type MetadataInfo = {
  description: string;
  imageBaseUrl: string;
}

const KEY = 'METADATA_KEY';

const MetaDataStorage = {
  save: (info: MetadataInfo) => localStorage.setItem(KEY, JSON.stringify(info)),
  restore: (): MetadataInfo | null => {
    const data = localStorage.getItem(KEY)
    if(!data) return null;
    return JSON.parse(data);
  }
}

export const useMetaInfo = () => {
  const [info, setInfo] = useState<MetadataInfo>({description: '', imageBaseUrl: ''});
  useEffect(() => {
    const data = MetaDataStorage.restore();
    if(data) setInfo(data);

    const cb = () => setInfo(i => {
      MetaDataStorage.save(i);
      return i;
    })
    window.addEventListener("beforeunload", cb);
    return () => window.removeEventListener("beforeunload", cb);
  }, []);

  return {
    info,
    setInfo,
  }
}