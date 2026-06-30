export type Coffee = {
  id: string;
  brand: string;
  blend: string;
  showOnLog: boolean;
  roastLevel: string | null;
  roastDate: string | null;
  origin: string | null;
  process: string | null;
  notes: string | null;
  createdAt: number;
  updatedAt: number;
};

export type Shot = {
  id: string;
  coffeeId: string;
  pulledAt: number;
  drinkType: string;
  doseGrams: number | null;
  yieldGrams: number | null;
  shotTimeSeconds: number | null;
  grindSize: string | null;
  grindTimeSeconds: number | null;
  temperatureC: number | null;
  rating: number | null;
  tasteNotes: string | null;
  machineNotes: string | null;
  resultNotes: string | null;
  createdAt: number;
  updatedAt: number;
};

export type RecentShot = Pick<
  Shot,
  'id' | 'pulledAt' | 'drinkType' | 'doseGrams' | 'yieldGrams' | 'shotTimeSeconds' | 'rating'
> & {
  coffeeBrand: string | null;
  coffeeBlend: string | null;
};
