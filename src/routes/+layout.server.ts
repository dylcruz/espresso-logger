import type { LayoutServerLoad } from './$types';
import { getUnitSystem } from '$lib/server/settings';

export const load: LayoutServerLoad = () => {
  return {
    unitSystem: getUnitSystem()
  };
};
