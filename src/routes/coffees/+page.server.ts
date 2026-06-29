import type { PageServerLoad } from './$types';
import { listCoffees } from '$lib/server/db';

export const load: PageServerLoad = () => {
  return {
    coffees: listCoffees()
  };
};
