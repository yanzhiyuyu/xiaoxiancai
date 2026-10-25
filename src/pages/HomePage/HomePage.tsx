import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useKitchen } from '@/kitchen/useKitchen';
import { CATEGORIES, CAT_EMOJI, type Category, type IFood } from '@/lib/types';
import AddFoodSheet from '@/components/AddFoodSheet';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Filter = '全部' | Category;

const TIER_BADGE: Record<string, string> = {
  低: 'bg-green-100 text-green-700',
  中: 'bg-amber-100 text-amber-700',
  高: 'bg-red-100 text-red-700',
};

function daysLeft(buy: string, days: number, delay: number) {
  const base = new Date(buy).getTime();
  const target = base + (days + delay) * 86400000;
  return Math.round((target - Date.now()) / 86400000);
}

function FoodRow({ f }: { f: IFood }) {
  const { extendFood, removeFood } = useKitchen();
  const dt = daysLeft(f.buy, f.tasteDays, f.delay);
  const de = daysLeft(f.buy, f.shelfDays, f.delay);
  const expired = de < 0;
  const soon = !expired && dt <= 2;

  return (
    <div className="bg-card rounded-2xl p-3 shadow-sm flex items-center gap-3">
      <div className="text-3xl">{f.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-[15px] truncate">{f.name}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${TIER_BADGE[f.calTier]}`}>
            {f.calTier}热
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {f.cat} · {f.loc} · {f.qty}{f.unit} · ¥{f.price.toFixed(1)}
        </div>
      </div>
      <div className="text-right flex flex-col items-end gap-1">
        {expired ? (
          <>
            <span className="text-red-600 font-semibold text-sm">已过期</span>
            <div className="flex gap-1">
              <button
                onClick={() => { removeFood(f.id); toast.success('已标记吃完'); }}
                className="text-[10px] px-2 py-0.5 rounded bg-red-100 text-red-700"
              >
                已处理
              </button>
              <button
                onClick={() => { extendFood(f.id, 3); toast.success('已延长 3 天'); }}
                className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-700"
              >
                延长
              </button>
            </div>
          </>
        ) : (
          <>
            <span className={`text-sm font-semibold ${soon ? 'text-amber-600' : 'text-foreground'}`}>
              {dt}天后
            </span>
            <span className="text-[10px] text-muted-foreground">赏味期</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { foods } = useKitchen();
  const [filter, setFilter] = useState<Filter>('全部');
  const [addOpen, setAddOpen] = useState(false);

  const now = new Date();
  const dateStr = `${now.getMonth() + 1}月${now.getDate()}日 周${'日一二三四五六'[now.getDay()]}`;

  const { soonList, expiredList, rest } = useMemo(() => {
    const soon: IFood[] = [];
    const expired: IFood[] = [];
    const rest: IFood[] = [];
    foods.forEach((f) => {
      const de = daysLeft(f.buy, f.shelfDays, f.delay);
      const dt = daysLeft(f.buy, f.tasteDays, f.delay);
      if (de < 0) expired.push(f);
      else if (dt <= 2) soon.push(f);
      else rest.push(f);
    });
    return { soonList: soon, expiredList: expired, rest };
  }, [foods]);

  const visible = useMemo(() => {
    const all = [...expiredList, ...soonList, ...rest];
    if (filter === '全部') return all;
    return all.filter((f) => f.cat === filter);
  }, [filter, soonList, expiredList, rest]);

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="text-xs text-muted-foreground">{dateStr}</div>
      <h1 className="text-2xl font-bold mt-1">
        冰箱里有 <span className="text-primary">{foods.length}</span> 样东西
      </h1>

      {soonList.length > 0 && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <div className="text-amber-800 text-sm font-semibold mb-1">⏰ 快到期了，可以先吃这些</div>
          <div className="space-y-1">
            {soonList.slice(0, 4).map((f) => (
              <div key={f.id} className="flex justify-between text-sm text-amber-900">
                <span>{f.emoji} {f.name}</span>
                <span className="text-amber-700">剩{daysLeft(f.buy, f.tasteDays, f.delay)}天</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {expiredList.length > 0 && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3">
          <div className="text-red-700 text-sm font-semibold mb-1">已过期，记得处理</div>
          <div className="text-sm text-red-800">
            {expiredList.map((f) => f.name).join('、')}
          </div>
        </div>
      )}

      <div className="mt-5 flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4">
        {(['全部', ...CATEGORIES] as Filter[]).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm border ${
              filter === c
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground'
            }`}
          >
            {c !== '全部' ? CAT_EMOJI[c as Category] + ' ' : ''}{c}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        {visible.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            这个分类里还没有食材
          </div>
        ) : (
          visible.map((f) => <FoodRow key={f.id} f={f} />)
        )}
      </div>

      <Button
        size="lg"
        className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setAddOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddFoodSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
