import { NavLink, Outlet } from 'react-router-dom';
import { KitchenProvider } from '@/kitchen/KitchenContext';
import { Toaster } from 'sonner';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBasket,
  BarChart3,
  User,
} from 'lucide-react';

const NAV = [
  { to: '/', label: '库存', icon: LayoutDashboard, end: true },
  { to: '/recipes', label: '菜谱', icon: UtensilsCrossed },
  { to: '/shop', label: '采购', icon: ShoppingBasket },
  { to: '/stats', label: '统计', icon: BarChart3 },
  { to: '/profile', label: '我的', icon: User },
];

export const Layout = () => {
  return (
    <KitchenProvider>
      <div className="min-h-screen w-full bg-[#e8e4dc] flex justify-center">
        {/* Phone shell */}
        <div className="w-full max-w-[420px] min-h-screen bg-background shadow-2xl relative flex flex-col">
          <div className="flex-1 overflow-y-auto pb-20">
            <Outlet />
          </div>

          {/* Bottom nav */}
          <nav className="absolute bottom-0 left-0 right-0 h-16 bg-card border-t flex items-stretch">
            {NAV.map((n) => {
              const Icon = n.icon;
              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    `flex-1 flex flex-col items-center justify-center gap-0.5 text-xs transition-colors ${
                      isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{n.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </KitchenProvider>
  );
};
