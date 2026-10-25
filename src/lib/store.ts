const NS = 'xiaoxiancai';

export const store = {
  get<T>(k: string, fb: T): T {
    try {
      const v = localStorage.getItem(`${NS}:${k}`);
      return v ? (JSON.parse(v) as T) : fb;
    } catch {
      return fb;
    }
  },
  set(k: string, v: unknown) {
    try {
      localStorage.setItem(`${NS}:${k}`, JSON.stringify(v));
    } catch {
      /* private mode */
    }
  },
};

export function offsetDays(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

export function dstr(d: Date): string {
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

export function daysBetween(a: string, b: Date = new Date()): number {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((da.getTime() - db.getTime()) / 86400000);
}
