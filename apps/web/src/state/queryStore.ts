/**
 * 查询状态管理
 * 管理查询相关的状态
 */

import { create } from 'zustand';

interface QueryState {
  queries: any[];
  currentQuery: any | null;
  setQueries: (queries: any[]) => void;
  setCurrentQuery: (query: any | null) => void;
}

export const useQueryStore = create<QueryState>((set) => ({
  queries: [],
  currentQuery: null,
  setQueries: (queries) => set({ queries }),
  setCurrentQuery: (query) => set({ currentQuery: query }),
}));
