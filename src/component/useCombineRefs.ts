import React, {Ref, useCallback} from "react";

export const useCombinedRefs = <T extends any>(...refs: Array<Ref<T>>): Ref<T> =>
  useCallback(
    (element: T) =>
      refs.forEach((ref) => {
        if (!ref) {
          return;
        }

        if (typeof ref === 'function') {
          return ref(element);
        }

        (ref as any).current = element;
      }),
    refs
  );

export const combineRefs = <T extends unknown>(...refs: React.MutableRefObject<T>[]) => (el: T) => refs.forEach(ref => {
  if (!ref) {
    return;
  }

  if (typeof ref === 'function') {
    return (ref as any)(el);
  }

  (ref as any).current = el;
});