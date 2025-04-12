import { create } from "zustand";

const useSkillStore = create((set) => ({
  suggestions: [],
  setSuggestions: (data) => set({ suggestions: data }),
}));

export default useSkillStore;
