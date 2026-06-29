import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import type { UnitSystem } from '$lib/units';
import { getUnitSystem, setUnitSystem } from '$lib/server/settings';

export const load: PageServerLoad = () => {
  return {
    unitSystem: getUnitSystem()
  };
};

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const unitSystem = formData.get('unitSystem');

    if (unitSystem !== 'metric' && unitSystem !== 'imperial') {
      return fail(400, { error: 'Choose metric or imperial units' });
    }

    setUnitSystem(unitSystem as UnitSystem);
    return { saved: true };
  }
} satisfies Actions;
