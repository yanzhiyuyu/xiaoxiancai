import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CATEGORIES, LOCATIONS, type Category, type Location, type CalTier } from '@/lib/types';
import { useKitchen } from '@/kitchen/useKitchen';
import { toast } from 'sonner';

const EMOJIS = ['🥬','🥕','🥔','🍅','🥒','🫑','🧄','🧅','🥦','🍄','🥝','🥑','🍎','🍌','🍊','🍇','🍓','🍍','🥭','🍗','🥩','🥚','🐟','🦐','🍚','🍜','🥖','🥛','🧀','🥫'];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddFoodSheet({ open, onClose }: Props) {
  const { addFood } = useKitchen();
  const [name, setName] = useState('');
  const [cat, setCat] = useState<Category>('蔬菜');
  const [emoji, setEmoji] = useState('🥬');
  const [qty, setQty] = useState('1');
  const [unit, setUnit] = useState('份');
  const [shelfDays, setShelfDays] = useState('7');
  const [tasteDays, setTasteDays] = useState('4');
  const [loc, setLoc] = useState<Location>('冷藏');
  const [calTier, setCalTier] = useState<CalTier>('中');
  const [price, setPrice] = useState('0');

  const tierStyle: Record<CalTier, string> = {
    低: 'bg-green-100 text-green-700 border-green-300',
    中: 'bg-amber-100 text-amber-700 border-amber-300',
    高: 'bg-red-100 text-red-700 border-red-300',
  };

  const submit = () => {
    if (!name.trim()) { toast.error('先给食材起个名'); return; }
    addFood({
      name: name.trim(),
      cat,
      emoji,
      qty: parseFloat(qty) || 1,
      unit,
      shelfDays: parseInt(shelfDays) || 7,
      tasteDays: parseInt(tasteDays) || 4,
      loc,
      cal: calTier === '低' ? 50 : calTier === '中' ? 150 : 300,
      calTier,
      price: parseFloat(price) || 0,
    });
    toast.success(`已把 ${name} 放进冰箱`);
    setName('');
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>添加食材</SheetTitle>
          <SheetDescription>录入一份新食材</SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-8 space-y-4">
          <div className="space-y-1.5">
            <Label>选个图标</Label>
            <div className="grid grid-cols-10 gap-1">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-xl p-1 rounded-md ${emoji === e ? 'bg-primary/20 ring-2 ring-primary' : ''}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="f-name">食材名称</Label>
            <Input id="f-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="比如：菠菜" />
          </div>

          <div className="space-y-1.5">
            <Label>分类</Label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${cat === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-card'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="f-qty">数量</Label>
              <Input id="f-qty" type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-unit">单位</Label>
              <Input id="f-unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="f-shelf">保质期(天)</Label>
              <Input id="f-shelf" type="number" value={shelfDays} onChange={(e) => setShelfDays(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-taste">赏味期(天)</Label>
              <Input id="f-taste" type="number" value={tasteDays} onChange={(e) => setTasteDays(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>存放位置</Label>
            <div className="flex gap-1.5">
              {LOCATIONS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLoc(l)}
                  className={`flex-1 py-2 rounded-lg border text-sm ${loc === l ? 'bg-primary text-primary-foreground border-primary' : 'bg-card'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>热量标签</Label>
            <div className="flex gap-1.5">
              {(['低', '中', '高'] as CalTier[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCalTier(t)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-semibold ${tierStyle[t]} ${calTier === t ? 'ring-2 ring-offset-1' : 'opacity-60'}`}
                >
                  {t}热量
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="f-price">预计花费(元)</Label>
            <Input id="f-price" type="number" step="0.1" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <Button className="w-full" size="lg" onClick={submit}>
            放进冰箱
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
