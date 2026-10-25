import { createContext } from 'react';
import type { IFood, IRecipe, IShopItem } from '@/lib/types';

export interface KitchenCtx {
  foods: IFood[];
  recipes: IRecipe[];
  shop: IShopItem[];
  nextId: () => number;
  addFood: (f: Omit<IFood, 'id' | 'buy' | 'delay'> & { buy?: string }) => void;
  removeFood: (id: number) => void;
  extendFood: (id: number, days: number) => void;
  toggleShop: (id: number) => void;
  addShop: (s: Omit<IShopItem, 'id' | 'done'>) => void;
  daysToExpiry: (f: IFood) => number;
  daysToTaste: (f: IFood) => number;
}

export const KitchenContext = createContext<KitchenCtx | null>(null);
