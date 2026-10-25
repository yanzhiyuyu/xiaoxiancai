import { useContext } from 'react';
import { KitchenContext } from './context';

export function useKitchen() {
  const c = useContext(KitchenContext);
  if (!c) throw new Error('useKitchen must be inside KitchenProvider');
  return c;
}
