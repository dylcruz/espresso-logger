import type { PageServerLoad } from './$types';
import { listCoffees } from '$lib/server/db';
import { getFieldVisibilityConfig } from '$lib/server/settings';

export const load: PageServerLoad = () => {
  return {
    coffees: listCoffees(),
    fieldConfig: getFieldVisibilityConfig()
  };
};
