/**
 * 规范状态管理
 * 管理规范相关的状态
 */

import { create } from 'zustand';
import type { Spec } from '../types/spec';

interface SpecState {
  specs: Spec[];
  currentSpec: Spec | null;
  setSpecs: (specs: Spec[]) => void;
  setCurrentSpec: (spec: Spec | null) => void;
}

export const useSpecStore = create<SpecState>((set) => ({
  specs: [],
  currentSpec: null,
  setSpecs: (specs) => set({ specs }),
  setCurrentSpec: (spec) => set({ currentSpec: spec }),
}));
