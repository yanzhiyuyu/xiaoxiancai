import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { useKitchen } from '@/kitchen/useKitchen';
import { CATEGORIES, type Category } from '@/lib/types';
import { toast } from 'sonner';

function AddShopSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addShop } = useKitchen();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🛒');
  const [cat, setCat] = useState<Category>('蔬菜');
  const [qty, setQty] = useState('1');
  const [unit, setUnit] = useState('份');
  const [price, setPrice] = useState('0');
  const [shelfDays, setShelfDays] = useState('7');

  const submit = () => {
    if (!name.trim()) { toast.error('先写食材名'); return; }
    addShop({
      name: name.trim(),
      emoji,
      cat,
      qty: parseFloat(qty) || 1,
      unit,
      price: parseFloat(price) || 0,
      shelfDays: parseInt(shelfDays) || 7,
    });
    toast.success('已加入采购清单');
    setName('');
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>添加采购项</SheetTitle>
          <SheetDescription>买完打勾会自动入库</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-8 space-y-4">
          <div className="space-y-1.5">
            <Label>图标</Label>
            <div className="flex gap-1.5 flex-wrap">
              {['🛒','🥬','🍎','🍗','🐟','🍚','🥛','🧀','🥚','🍅'].map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-xl p-1.5 rounded-md ${emoji === e ? 'bg-primary/20 ring-2 ring-primary' : ''}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-name">食材名称</Label>
            <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="比如：牛奶" />
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
              <Label htmlFor="s-qty">数量</Label>
              <Input id="s-qty" type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-unit">单位</Label>
              <Input id="s-unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="s-price">预计单价(元)</Label>
              <Input id="s-price" type="number" step="0.1" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-shelf">保质期(天)</Label>
              <Input id="s-shelf" type="number" value={shelfDays} onChange={(e) => setShelfDays(e.target.value)} />
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={submit}>加入采购清单</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function ShopPage() {
  const { shop, toggleShop } = useKitchen();
  const [addOpen, setAddOpen] = useState(false);

  const pending = shop.filter((s) => !s.done);
  const total = pending.reduce((a, s) => a + s.price * s.qty, 0);

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold mt-1">采购清单</h1>
      <p className="text-sm text-muted-foreground mt-1">缺的菜、想囤的货都记在这，买完打勾自动入库</p>

      <div className="mt-4 bg-card rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">预计花费</div>
          <div className="text-2xl font-bold text-primary mt-0.5">¥{total.toFixed(1)}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">待采购</div>
          <div className="text-2xl font-bold mt-0.5">{pending.length}</div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {shop.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            采购清单是空的<br />从菜谱推荐里一键加缺料
          </div>
        ) : (
          shop.map((s) => (
            <div
              key={s.id}
              className={`bg-card rounded-xl p-3 flex items-center gap-3 shadow-sm ${s.done ? 'opacity-50' : ''}`}
            >
              <button
                onClick={() => toggleShop(s.id)}
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                  s.done ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/40'
                }`}
              >
                {s.done && <Check className="w-4 h-4" />}
              </button>
              <span className="text-2xl">{s.emoji}</span>
              <div className="flex-1">
                <div className={`font-medium ${s.done ? 'line-through' : ''}`}>{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.qty}{s.unit}</div>
              </div>
              {s.price > 0 && (
                <span className="text-sm text-muted-foreground">¥{(s.price * s.qty).toFixed(1)}</span>
              )}
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => setAddOpen(true)}
        className="mt-4 w-full py-3.5 border-2 border-dashed border-border rounded-2xl text-primary font-semibold"
      >
        + 添加新采购项
      </button>

      <AddShopSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
