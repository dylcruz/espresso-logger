import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';
import { deleteShot, getCoffee, getShot, listCoffees, updateShot } from '$lib/server/db';
import { getUnitSystem } from '$lib/server/settings';
import { optionalInteger, optionalNumber, optionalString, parseDateTime, requiredString } from '$lib/server/forms';
import { toStoredTemperature, toStoredWeight } from '$lib/units';

export const load: PageServerLoad = ({ params }) => {
  const shot = getShot(params.id);
  if (!shot) throw error(404, 'Shot not found');

  const coffee = getCoffee(shot.coffeeId);

  return {
    shot,
    coffee,
    coffees: listCoffees()
  };
};

export const actions = {
  update: async ({ request, params }) => {
    const formData = await request.formData();
    const unitSystem = getUnitSystem();

    try {
      updateShot(params.id, {
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

      return { saved: true };
    } catch (error) {
      return fail(400, { error: error instanceof Error ? error.message : 'Could not update shot' });
    }
  },
  delete: async ({ params }) => {
    deleteShot(params.id);
    throw redirect(303, '/');
  }
} satisfies Actions;
