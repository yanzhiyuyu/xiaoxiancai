import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import HomePage from '@/pages/HomePage/HomePage';
import RecipesPage from '@/pages/RecipesPage/RecipesPage';
import ShopPage from '@/pages/ShopPage/ShopPage';
import StatsPage from '@/pages/StatsPage/StatsPage';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="recipes" element={<RecipesPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
