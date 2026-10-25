import { useMemo, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useKitchen } from '@/kitchen/useKitchen';
import type { IRecipe } from '@/lib/types';
import { toast } from 'sonner';

function matchScore(recipe: IRecipe, foods: { name: string }[]) {
  const names = foods.map((f) => f.name);
  let have = 0;
  recipe.need.forEach((n) => {
    if (names.some((h) => n.includes(h) || h.includes(n))) have++;
  });
  return Math.round((have / recipe.need.length) * 100);
}

function RecipeDetail({
  recipe,
  onClose,
}: {
  recipe: IRecipe;
  onClose: () => void;
}) {
  const { foods, shop, addShop } = useKitchen();
  const names = foods.map((f) => f.name);
  const [marks, setMarks] = useState<Record<string, 'have' | 'shop'>>({});

  const missing = recipe.need.filter((n) => !names.some((h) => n.includes(h) || h.includes(n)));

  const addToShop = (ing: string) => {
    if (shop.find((s) => s.name === ing)) {
      toast.info(`${ing} 已在采购清单里`);
      return;
    }
    addShop({
      name: ing,
      emoji: '🛒',
      cat: '蔬菜',
      qty: 1,
      unit: '份',
      price: 0,
      shelfDays: 7,
    });
    setMarks((m) => ({ ...m, [ing]: 'shop' }));
    toast.success(`${ing} 已加入采购清单`);
  };

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="text-3xl">{recipe.emoji}</span>
            {recipe.name}
          </SheetTitle>
          <SheetDescription>{recipe.desc} · 约 {recipe.kcal}kcal</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-8 space-y-5">
          <div>
            <div className="font-semibold text-sm mb-2">需要的食材</div>
            <div className="space-y-2">
              {recipe.need.map((n) => {
                const inFridge = names.some((h) => n.includes(h) || h.includes(n));
                const mark = marks[n];
                return (
                  <div key={n} className="flex items-center justify-between bg-muted/50 rounded-lg p-2.5">
                    <span className="text-sm">{n}</span>
                    {inFridge ? (
                      <span className="text-xs text-green-700 font-semibold">已有</span>
                    ) : mark === 'shop' ? (
                      <span className="text-xs text-purple-700 font-semibold">已加采购清单</span>
                    ) : (
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="secondary" onClick={() => { setMarks((m) => ({ ...m, [n]: 'have' })); toast.success(`已标记家里有 ${n}`); }}>
                          已有
                        </Button>
                        <Button size="sm" onClick={() => addToShop(n)}>
                          加入采购
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {missing.length > 0 && (
              <div className="text-xs text-muted-foreground mt-2">
                缺 {missing.length} 样：{missing.join('、')}
              </div>
            )}
          </div>

          <div>
            <div className="font-semibold text-sm mb-2">做法步骤</div>
            <div className="space-y-2.5">
              {recipe.steps.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                    {i + 1}
                  </div>
                  <span className="text-sm leading-6">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function RecipesPage() {
  const { foods, recipes } = useKitchen();
  const [openId, setOpenId] = useState<number | null>(null);

  const scored = useMemo(
    () =>
      recipes
        .map((r) => ({ r, score: matchScore(r, foods) }))
        .sort((a, b) => b.score - a.score),
    [recipes, foods],
  );

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold mt-1">菜谱</h1>
      <p className="text-sm text-muted-foreground mt-1">根据冰箱里现有的食材，推荐最匹配的菜</p>

      <div className="mt-5 space-y-3">
        {scored.map(({ r, score }) => {
          const low = score < 50;
          const bg = score >= 70 ? 'bg-green-50' : score >= 50 ? 'bg-amber-50' : 'bg-red-50';
          return (
            <div
              key={r.id}
              onClick={() => setOpenId(r.id)}
              className={`${bg} rounded-2xl p-3 flex items-center gap-3 cursor-pointer shadow-sm`}
            >
              <div className="text-4xl">{r.emoji}</div>
              <div className="flex-1">
                <div className="font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.desc} · 约 {r.kcal}kcal</div>
                <div className="mt-2 h-1.5 bg-white rounded-full overflow-hidden">
                  <div
                    className={`h-full ${low ? 'bg-red-400' : 'bg-primary'}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <div className="text-xs mt-1 flex justify-between">
                  <span className="text-muted-foreground">
                    {r.need.filter((n) => foods.some((f) => n.includes(f.name) || f.name.includes(n))).length}/{r.need.length} 样已有
                  </span>
                  <span className={low ? 'text-red-600 font-semibold' : 'font-semibold'}>{score}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {openId !== null && (
        <RecipeDetail
          recipe={recipes.find((r) => r.id === openId)!}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
