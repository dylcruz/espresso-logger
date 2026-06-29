import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createShot, listCoffees } from '$lib/server/db';
import { getUnitSystem } from '$lib/server/settings';
import { optionalInteger, optionalNumber, optionalString, parseDateTime, requiredString } from '$lib/server/forms';
import { toStoredTemperature, toStoredWeight } from '$lib/units';

export const load: PageServerLoad = ({ url }) => {
  return {
    coffees: listCoffees(),
    selectedCoffeeId: url.searchParams.get('coffee')
  };
};

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const unitSystem = getUnitSystem();
    const id = crypto.randomUUID();

    try {
      createShot({
        id,
        coffeeId: requiredString(formData, 'coffeeId'),
        pulledAt: parseDateTime(formData, 'pulledAt'),
        drinkType: requiredString(formData, 'drinkType'),
        doseGrams: toStoredWeight(optionalNumber(formData, 'dose'), unitSystem),
        yieldGrams: toStoredWeight(optionalNumber(formData, 'yield'), unitSystem),
        shotTimeSeconds: optionalNumber(formData, 'shotTimeSeconds'),
        grindSize: optionalString(formData, 'grindSize'),
        grindTimeSeconds: optionalNumber(formData, 'grindTimeSeconds'),
        temperatureC: toStoredTemperature(optionalNumber(formData, 'temperature'), unitSystem),
        rating: optionalInteger(formData, 'rating'),
        tasteNotes: optionalString(formData, 'tasteNotes'),
        machineNotes: optionalString(formData, 'machineNotes'),
        resultNotes: optionalString(formData, 'resultNotes')
      });
    } catch (error) {
      return fail(400, { error: error instanceof Error ? error.message : 'Could not save shot' });
    }

    throw redirect(303, `/shots/${id}`);
  }
} satisfies Actions;
