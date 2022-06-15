import * as Rand from "seedrandom";

export const shuffle = <T extends any>([...array]: T[]): T[] => {
  const rand: () => number = (Rand as any)('hoge');

  for (let i = array.length - 1; i >= 0; i--) {
    rand()
    const j = Math.floor(rand() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
