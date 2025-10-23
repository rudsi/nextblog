import { create, StateCreator } from "zustand"
import { Post } from "@/types/post"
import { Category } from "@/types/post"

interface StoreState {
  posts: Post[]             
  categories: Category[]    
  setPosts: (posts: Post[]) => void         
  setCategories: (categories: Category[]) => void   
}

export const useStore = create<StoreState>((set: Parameters<StateCreator<StoreState>>[0]) => ({
  posts: [],
  categories: [],
  setPosts: (posts: Post[]) => set({ posts }),
  setCategories: (categories: Category[]) => set({ categories }),
}))
