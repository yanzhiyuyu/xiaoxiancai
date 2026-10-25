import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { KitchenContext, type KitchenCtx } from './context';
import type { IFood, IShopItem } from '@/lib/types';
import { SEED_FOODS, SEED_RECIPES, SEED_SHOP } from '@/lib/seed';
import { store, dstr } from '@/lib/store';

export function KitchenProvider({ children }: { children: ReactNode }) {
  const [foods, setFoods] = useState<IFood[]>(() => store.get<IFood[]>('foods', SEED_FOODS));
  const [shop, setShop] = useState<IShopItem[]>(() => store.get<IShopItem[]>('shop', SEED_SHOP));
  const [seq, setSeq] = useState<number>(() => store.get('seq', 100));

  useEffect(() => store.set('foods', foods), [foods]);
  useEffect(() => store.set('shop', shop), [shop]);
  useEffect(() => store.set('seq', seq), [seq]);

  const nextId = () => {
    setSeq((s) => s + 1);
    return seq;
  };

  const addFood: KitchenCtx['addFood'] = (f) => {
    setFoods((prev) => [
      ...prev,
      {
        ...f,
        id: seq,
        buy: f.buy || dstr(new Date()),
        delay: 0,
      } as IFood,
    ]);
    setSeq((s) => s + 1);
  };

  const removeFood = (id: number) => setFoods((prev) => prev.filter((f) => f.id !== id));

  const extendFood = (id: number, days: number) =>
    setFoods((prev) => prev.map((f) => (f.id === id ? { ...f, delay: f.delay + days } : f)));

  const toggleShop = (id: number) => {
    setShop((prev) => {
      const item = prev.find((s) => s.id === id);
      if (!item) return prev;
      const nowDone = !item.done;
      if (nowDone) {
        setFoods((fs) => [
          ...fs,
          {
            id: seq,
            name: item.name,
            cat: item.cat,
            qty: item.qty,
            unit: item.unit,
            buy: dstr(new Date()),
            shelfDays: item.shelfDays,
            tasteDays: Math.max(1, Math.round(item.shelfDays * 0.6)),
            loc: '冷藏',
            cal: 0,
            calTier: '中',
            price: item.price * item.qty,
            emoji: item.emoji,
            delay: 0,
          },
        ]);
        setSeq((s) => s + 1);
      }
      return prev.map((s) => (s.id === id ? { ...s, done: nowDone } : s));
    });
  };

  const addShop: KitchenCtx['addShop'] = (s) => {
    setShop((prev) => [...prev, { ...s, id: seq, done: false }]);
    setSeq((s) => s + 1);
  };

  const daysToExpiry = (f: IFood) => {
    const expire = new Date(f.buy + 'T00:00:00');
    expire.setDate(expire.getDate() + f.shelfDays + f.delay);
    return Math.round((expire.getTime() - Date.now()) / 86400000);
  };

  const daysToTaste = (f: IFood) => {
    const t = new Date(f.buy + 'T00:00:00');
    t.setDate(t.getDate() + f.tasteDays + f.delay);
    return Math.round((t.getTime() - Date.now()) / 86400000);
  };

  const value = useMemo<KitchenCtx>(
    () => ({
      foods,
      recipes: SEED_RECIPES,
      shop,
      nextId,
      addFood,
      removeFood,
      extendFood,
      toggleShop,
      addShop,
      daysToExpiry,
      daysToTaste,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [foods, shop, seq],
  );

  return <KitchenContext.Provider value={value}>{children}</KitchenContext.Provider>;
}
