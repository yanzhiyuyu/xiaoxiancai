import type { IFood, IRecipe, IShopItem } from './types';
import { dstr, offsetDays } from './store';

export const SEED_FOODS: IFood[] = [
  { id: 1, name: '菠菜', cat: '蔬菜', qty: 1, unit: '把', buy: dstr(offsetDays(-2)), shelfDays: 5, tasteDays: 2, loc: '冷藏', cal: 28, calTier: '低', price: 5.8, emoji: '🥬', delay: 0 },
  { id: 2, name: '猕猴桃', cat: '水果', qty: 3, unit: '个', buy: dstr(offsetDays(-4)), shelfDays: 10, tasteDays: 5, loc: '冷藏', cal: 61, calTier: '低', price: 10.5, emoji: '🥝', delay: 0, ripeness: '硬', ripeEta: '2-3 天' },
  { id: 3, name: '鸡胸肉', cat: '肉蛋', qty: 500, unit: '克', buy: dstr(offsetDays(-3)), shelfDays: 3, tasteDays: 2, loc: '冷藏', cal: 133, calTier: '中', price: 12.8, emoji: '🍗', delay: 0 },
  { id: 4, name: '牛油果', cat: '水果', qty: 2, unit: '个', buy: dstr(offsetDays(-1)), shelfDays: 7, tasteDays: 4, loc: '冷藏', cal: 160, calTier: '中', price: 17.0, emoji: '🥑', delay: 0, ripeness: '熟' },
  { id: 5, name: '鸡蛋', cat: '肉蛋', qty: 6, unit: '个', buy: dstr(offsetDays(-1)), shelfDays: 20, tasteDays: 10, loc: '冷藏', cal: 144, calTier: '中', price: 7.2, emoji: '🥚', delay: 0 },
  { id: 6, name: '番茄', cat: '蔬菜', qty: 4, unit: '个', buy: dstr(offsetDays(-2)), shelfDays: 8, tasteDays: 5, loc: '常温', cal: 18, calTier: '低', price: 10.0, emoji: '🍅', delay: 0 },
  { id: 7, name: '三文鱼', cat: '水产', qty: 300, unit: '克', buy: dstr(offsetDays(-1)), shelfDays: 2, tasteDays: 1, loc: '冷藏', cal: 208, calTier: '高', price: 38.0, emoji: '🐟', delay: 0 },
  { id: 8, name: '大米', cat: '粮油', qty: 5, unit: '斤', buy: dstr(offsetDays(-10)), shelfDays: 180, tasteDays: 120, loc: '常温', cal: 346, calTier: '高', price: 16.0, emoji: '🍚', delay: 0 },
];

export const SEED_RECIPES: IRecipe[] = [
  { id: 1, name: '番茄炒蛋', emoji: '🍳', desc: '家常快手菜', kcal: 320, need: ['番茄', '鸡蛋', '葱'], steps: ['番茄切块，鸡蛋打散', '热油先炒鸡蛋盛出', '炒番茄出沙，倒回鸡蛋翻匀'] },
  { id: 2, name: '香煎鸡胸', emoji: '🍗', desc: '高蛋白低卡', kcal: 280, need: ['鸡胸肉', '黑胡椒', '盐'], steps: ['鸡胸横片，盐和胡椒腌10分钟', '小火每面煎4分钟', '出锅静置3分钟再切'] },
  { id: 3, name: '牛油果沙拉', emoji: '🥗', desc: '清爽轻食', kcal: 220, need: ['牛油果', '番茄', '生菜', '柠檬汁'], steps: ['牛油果和番茄切块', '生菜垫底', '淋柠檬汁和盐'] },
  { id: 4, name: '猕猴桃思慕雪', emoji: '🥤', desc: '维生素C拉满', kcal: 180, need: ['猕猴桃', '酸奶', '蜂蜜'], steps: ['猕猴桃去皮切块', '和酸奶一起打匀', '淋一点蜂蜜'] },
  { id: 5, name: '三文鱼刺身', emoji: '🍣', desc: '冰镇即食', kcal: 250, need: ['三文鱼', '芥末', '酱油'], steps: ['三文鱼提前放冷藏解冻', '切厚片', '配芥末酱油'] },
  { id: 6, name: '菠菜蛋花汤', emoji: '🍲', desc: '暖胃又清淡', kcal: 120, need: ['菠菜', '鸡蛋', '盐'], steps: ['水烧开下菠菜', '蛋液转圈淋入', '加盐出锅'] },
];

export const SEED_SHOP: IShopItem[] = [
  { id: 1, name: '牛奶', emoji: '🥛', cat: '乳制品', qty: 1, unit: '盒', price: 12.5, shelfDays: 7, done: false },
  { id: 2, name: '生菜', emoji: '🥬', cat: '蔬菜', qty: 1, unit: '颗', price: 4.5, shelfDays: 5, done: false },
];
