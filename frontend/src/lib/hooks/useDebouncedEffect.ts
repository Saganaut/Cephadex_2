import { useEffect } from "react";

export const useDebouncedEffect = (
  effect: any,
  deps: any,
  delay: number,
): void => {
  useEffect(() => {
    const handler = setTimeout(() => {
      effect();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...(deps ?? []), delay]);
};
