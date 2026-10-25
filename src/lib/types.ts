// EXPORTS: Category, Location, CalTier, IFood, IRecipe, IShopItem
export type Category = '蔬菜' | '水果' | '肉蛋' | '水产' | '粮油' | '乳制品';
export type Location = '冷藏' | '冷冻' | '常温';
export type CalTier = '低' | '中' | '高';

export interface IFood {
  id: number;
  name: string;
  cat: Category;
  qty: number;
  unit: string;
  buy: string; // YYYY-MM-DD
  shelfDays: number;
  tasteDays: number; // best-before (赏味期), usually shorter than shelfDays
  loc: Location;
  cal: number; // kcal per 100g
  calTier: CalTier;
  price: number; // per unit
  emoji: string;
  delay: number; // days postponed by user
  ripeness?: '硬' | '半熟' | '熟';
  ripeEta?: string;
  note?: string;
}

export interface IRecipe {
  id: number;
  name: string;
  emoji: string;
  desc: string;
  kcal: number;
  need: string[];
  steps: string[];
}

export interface IShopItem {
  id: number;
  name: string;
  emoji: string;
  cat: Category;
  qty: number;
  unit: string;
  price: number; // per unit
  shelfDays: number;
  done: boolean;
}

export const CATEGORIES: Category[] = ['蔬菜', '水果', '肉蛋', '水产', '粮油', '乳制品'];
export const LOCATIONS: Location[] = ['冷藏', '冷冻', '常温'];
export const CAT_EMOJI: Record<Category, string> = {
  蔬菜: '🥬', 水果: '🍎', 肉蛋: '🍗', 水产: '🐟', 粮油: '🌾', 乳制品: '🥛',
};
