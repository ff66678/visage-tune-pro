import { createContext, useContext, RefObject } from "react";

interface ScrollContextValue {
  scrollRef: RefObject<HTMLDivElement> | null;
}

const ScrollContext = createContext<ScrollContextValue>({ scrollRef: null });

export const ScrollProvider = ScrollContext.Provider;
export const useScrollContainer = () => useContext(ScrollContext).scrollRef;
