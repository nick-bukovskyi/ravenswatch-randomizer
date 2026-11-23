import { createContext, type RefObject } from 'react';

export const RerollFocusContext = createContext<RefObject<number | null>>({ current: null });
