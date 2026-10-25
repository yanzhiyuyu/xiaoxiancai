import { useMemo, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useKitchen } from '@/kitchen/useKitchen';
import { CATEGORIES, CAT_EMOJI, type Category } from '@/lib/types';

function daysLeft(buy: string, days: number, delay: number) {
  return Math.round((new Date(buy).getTime() + (days + delay) * 86400000 - Date.now()) / 86400000);
}

export default function StatsPage() {
  const { foods } = useKitchen();
  const [openCat, setOpenCat] = useState<Category | null>(null);

  const stats = useMemo(() => {
    const expired = foods.filter((f) => daysLeft(f.buy, f.shelfDays, f.delay) < 0);
    const totalValue = foods.reduce((a, f) => a + f.price, 0);
    const highCal = foods.filter((f) => f.calTier === '高');
    return { expired, totalValue, highCal };
  }, [foods]);

  const tierDist = useMemo(() => {
    const d = { 低: 0, 中: 0, 高: 0 };
    foods.forEach((f) => { d[f.calTier]++; });
    return d;
  }, [foods]);

  const catDist = useMemo(() => {
    return CATEGORIES.map((c) => {
      const items = foods.filter((f) => f.cat === c);
      const count = items.length;
      const value = items.reduce((a, f) => a + f.price, 0);
      return { cat: c, count, value, items };
    }).filter((c) => c.count > 0);
  }, [foods]);

  const maxCount = Math.max(1, ...catDist.map((c) => c.count));

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold mt-1">统计</h1>
      <p className="text-sm text-muted-foreground mt-1">看看冰箱里都有些什么</p>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">总食材</div>
          <div className="text-2xl font-bold mt-1">{foods.length}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">样</div>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">已过期</div>
          <div className="text-2xl font-bold mt-1 text-red-600">{stats.expired.length}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">样</div>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">库存价值</div>
          <div className="text-2xl font-bold mt-1">¥{stats.totalValue.toFixed(0)}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">按单价算</div>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">高热量食材</div>
          <div className="text-2xl font-bold mt-1 text-red-500">{stats.highCal.length}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">样要少吃</div>
        </div>
      </div>

      {/* Calorie distribution */}
      <div className="mt-5 bg-card rounded-2xl p-4 shadow-sm">
        <div className="font-semibold text-sm mb-3">热量分布</div>
        <div className="space-y-2">
          {([['低', tierDist.低, 'bg-green-500'], ['中', tierDist.中, 'bg-amber-500'], ['高', tierDist.高, 'bg-red-500']] as const).map(([label, n, color]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs w-8 text-muted-foreground">{label}热</span>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${color}`}
                  style={{ width: `${foods.length ? (n / foods.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs w-6 text-right">{n}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="mt-4 bg-card rounded-2xl p-4 shadow-sm">
        <div className="font-semibold text-sm mb-3">分类占比（点进去看明细）</div>
        <div className="space-y-3">
          {catDist.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-4">还没有食材</div>
          )}
          {catDist.map((c) => (
            <button
              key={c.cat}
              onClick={() => setOpenCat(c.cat)}
              className="w-full text-left"
            >
              <div className="flex justify-between text-sm mb-1">
                <span>{CAT_EMOJI[c.cat]} {c.cat}</span>
                <span className="text-muted-foreground text-xs">
                  {c.count} 样 · ¥{c.value.toFixed(1)} ›
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(c.count / maxCount) * 100}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Category detail sheet */}
      <Sheet open={openCat !== null} onOpenChange={(o) => !o && setOpenCat(null)}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {openCat ? `${CAT_EMOJI[openCat]} ${openCat}` : ''}
            </SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-8 space-y-2">
            {openCat &&
              foods
                .filter((f) => f.cat === openCat)
                .map((f) => (
                  <div key={f.id} className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
                    <span className="text-2xl">{f.emoji}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{f.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {f.qty}{f.unit} · ¥{f.price.toFixed(1)} · {f.loc}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
