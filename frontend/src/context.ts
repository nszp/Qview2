import { createContext, type Ref } from "react";

interface ScrollRefsContextType {
  scrollRefs: Ref<HTMLElement>[];
  setScrollRefs: (
    refs:
      | Ref<HTMLElement>[]
      | ((prev: Ref<HTMLElement>[]) => Ref<HTMLElement>[]),
  ) => void;
}

export const ScrollRefsContext = createContext<ScrollRefsContextType>(
  // @ts-ignore
  null,
);
