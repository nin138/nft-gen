import {useEffect, useState} from "react";

export type Size = {
  w: number
  h: number
}

export type Config = {
  name: string
  size: Size
  numberOfToken: number;
}

const defaultConfig: Config = {
  name: 'NFT',
  size: {
    w: 600,
    h: 600,
  },
  numberOfToken: 100,
}

const KEY = 'CONFIG_KEY';

const ConfigStorage = {
  save: (config: Config) => localStorage.setItem(KEY, JSON.stringify(config)),
  restore: (): Config | null => {
    const data = localStorage.getItem(KEY)
    if(!data) return null;
    return JSON.parse(data);
  }
}

export const useConfig = () => {
  const [config, setConfig] = useState(defaultConfig);
  useEffect(() => {
    const data = ConfigStorage.restore();
    if(data) setConfig(data);

    const cb = () => setConfig(c => {
      ConfigStorage.save(c);
      return c;
    })
    window.addEventListener("beforeunload", cb);
    return () => window.removeEventListener("beforeunload", cb);
  }, []);

  return {
    config,
    setConfig,
  }
}