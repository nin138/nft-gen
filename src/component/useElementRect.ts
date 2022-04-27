import React, { useEffect, useState } from 'react';

export const useElementRect = (ref: React.RefObject<HTMLElement | undefined>): DOMRect | undefined => {
  const [rect, setRect] = useState<DOMRect>();
  useEffect(() => {
    const cb = () => {
      if (ref.current) setRect(ref.current.getBoundingClientRect());
    };

    const observer = new ResizeObserver(cb);

    if (ref.current) {
      observer.observe(ref.current.parentElement!);
      window.addEventListener('resize', cb);
      setRect(ref.current.getBoundingClientRect());
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', cb);
    };
  }, [ref.current]);
  return rect;
};