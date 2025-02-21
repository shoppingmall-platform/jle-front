import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCategories, createCategories, updateCategories, deleteCategories } from "@/apis/product/categoryApis";

/**
 * @typedef {Object} Category
 * @property {number} categoryId - 카테고리 ID
 * @property {number | null} categoryParent - 부모 카테고리 ID (없으면 null)
 * @property {string} categoryName - 카테고리명
 * @property {number} categoryLevel - 카테고리 깊이
 */

/**
 * @typedef {Object} CategoryStore
 * @property {Category[]} categories - 카테고리 목록
 * @property {boolean} loading - 로딩 상태
 * @property {string | null} error - 에러 메시지
 * @property {() => Promise<void>} fetchCategoryData - 카테고리 데이터 불러오기
 * @property {(newCategory: Category) => void} addCategory - 새 카테고리 추가
 * @property {(updatedCategory: Category) => void} updateCategory - 카테고리 수정
 * @property {(categoryId: number) => void} deleteCategory - 카테고리 삭제
 */

/** @type {import("zustand").StoreApi<CategoryStore>} */
export const useCategoryStore = create(
    persist(
      (set) => ({
        categories: [
					{ categoryId: 1, categoryParent: null, categoryName: '대분류1', categoryLevel: 1 },
					{ categoryId: 2, categoryParent: 1, categoryName: '중분류1', categoryLevel: 2 },
					{ categoryId: 3, categoryParent: null, categoryName: '대분류2', categoryLevel: 1 },
					{ categoryId: 4, categoryParent: 3, categoryName: '중분류2', categoryLevel: 2 },
				],
        loading: false,
        error: null,
  
        /**
         * 카테고리 목록 불러오기 (GET)
         */
        fetchCategories: async () => {
          set({ loading: true, error: null });
          try {
            const data = await getCategories();
            set({ categories: data, loading: false });
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },
  
        /**
         * 새로운 카테고리 추가 (POST)
         * @param {Object} newCategory - 추가할 카테고리 정보
         */
        addCategory: async (newCategory) => {
          set({ loading: true });
          try {
            const createdCategory = await createCategories(newCategory);
            set((state) => ({
              categories: [...state.categories, { ...newCategory, categoryId: createdCategory.categoryId }],
              loading: false,
            }));
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },
  
        /**
         * 카테고리 수정 (POST)
         * @param {number} categoryId - 수정할 카테고리 ID
         * @param {Object} updatedData - 변경할 데이터
         */
        modifyCategory: async (categoryId, updatedData) => {
          set({ loading: true });
          try {
            await updateCategories(categoryId, updatedData);
            set((state) => ({
              categories: state.categories.map((cat) => (cat.categoryId === categoryId ? { ...cat, ...updatedData } : cat)),
              loading: false,
            }));
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },
  
        /**
         * 카테고리 삭제 (POST)
         * @param {number} categoryId - 삭제할 카테고리 ID
         */
        removeCategory: async (categoryId) => {
          set({ loading: true });
          try {
            await deleteCategories(categoryId);
            set((state) => ({
              categories: state.categories.filter((cat) => cat.categoryId !== categoryId),
              loading: false,
            }));
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },
      }),
      {
        name: "category-storage",
        getStorage: () => localStorage,
      }
    )
  );