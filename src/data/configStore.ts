import {useEffect, useState} from "react";

export type Size = {
  w: number
  h: number
}

export const AlgorithmTypes = {
  'Std': 'Std',
  'Combine': 'Combine',
} as const;

export type Config = {
  name: string
  size: Size
  numberOfToken: number;
  algorithm: keyof typeof AlgorithmTypes
}

const defaultConfig: Config = {
  name: 'NFT',
  size: {
    w: 600,
    h: 600,
  },
  numberOfToken: 100,
  algorithm: AlgorithmTypes.Std,
}

const KEY = 'CONFIG_KEY';

export const restoreConfig = (configLike: Partial<Config>): Config => {
  return {
    ...defaultConfig,
    ...configLike,
  }
}

const ConfigStorage = {
  save: (config: Config) => localStorage.setItem(KEY, JSON.stringify(config)),
  restore: (): Config | null => {
    const data = localStorage.getItem(KEY)
    if(!data) return null;
    return restoreConfig(JSON.parse(data));
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
