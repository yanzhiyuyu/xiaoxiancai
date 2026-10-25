import { Bell, Flame, Database, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold mt-1">我的</h1>

      <div className="mt-5 bg-card rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
          🥬
        </div>
        <div>
          <div className="font-semibold">小鲜菜</div>
          <div className="text-xs text-muted-foreground mt-0.5">家里冰箱我管着</div>
        </div>
      </div>

      <div className="mt-4 bg-card rounded-2xl shadow-sm divide-y">
        <button
          onClick={() => toast.info('通知设置：已开启')}
          className="w-full p-4 flex items-center gap-3"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1 text-left">
            <div className="text-sm">消息通知</div>
            <div className="text-xs text-muted-foreground">赏味期和保质期到期提醒</div>
          </div>
          <span className="text-muted-foreground">›</span>
        </button>
        <button
          onClick={() => toast.info('热量阈值：>300kcal/份 标记为高热量')}
          className="w-full p-4 flex items-center gap-3"
        >
          <Flame className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1 text-left">
            <div className="text-sm">热量标记阈值</div>
            <div className="text-xs text-muted-foreground">可自定义高低热量标准</div>
          </div>
          <span className="text-muted-foreground">›</span>
        </button>
        <button
          onClick={() => toast.info('数据存在当前浏览器本地，换设备不同步')}
          className="w-full p-4 flex items-center gap-3"
        >
          <Database className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1 text-left">
            <div className="text-sm">数据存储</div>
            <div className="text-xs text-muted-foreground">浏览器本地保存，不上传服务器</div>
          </div>
          <span className="text-muted-foreground">›</span>
        </button>
        <button
          onClick={() => toast.info('小鲜菜 v0.1 · 家庭食材库存管理')}
          className="w-full p-4 flex items-center gap-3"
        >
          <Info className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1 text-left">
            <div className="text-sm">关于</div>
            <div className="text-xs text-muted-foreground">版本 0.1.0</div>
          </div>
          <span className="text-muted-foreground">›</span>
        </button>
      </div>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        小鲜菜 · 让家里少浪费点菜
      </div>
    </div>
  );
}
