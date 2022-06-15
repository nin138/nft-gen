import {useCallback, useEffect, useRef, useState} from 'react';

export const useElementRect = (): { rect: DOMRect | undefined, ref: (node: HTMLElement | SVGElement | null) => void } => {
  const [rect, setRect] = useState<DOMRect>();
  const [dom, setDom] = useState<HTMLElement|SVGElement>();

  const observer = useRef(new ResizeObserver(() => {}))
  const ref = useCallback((node: HTMLElement | SVGElement | null) => {
    observer.current.disconnect();
    if(node === null) return;
    setDom(node);
    setRect(node?.getBoundingClientRect());
    observer.current = new ResizeObserver(() => setRect(node.getBoundingClientRect()));
    observer.current.observe(node.parentElement!);
  }, []);

  useEffect(() => {
    const cb = () => {
      setRect(dom?.getBoundingClientRect());
    }
    if (dom) {
      window.addEventListener('resize', cb);
    }

    return () => {
      window.removeEventListener('resize', cb);
    };
  }, [dom]);
  return {
    ref,
    rect,
  };
};
