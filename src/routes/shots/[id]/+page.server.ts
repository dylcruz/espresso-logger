import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';
import { deleteShot, getCoffee, getCustomFieldValues, getShot, listCoffees, listCustomFields, setCustomFieldValues, updateShot } from '$lib/server/db';
import { getFieldVisibilityConfig, getUnitSystem } from '$lib/server/settings';
import { optionalInteger, optionalNumber, optionalString, parseDateTime, requiredString } from '$lib/server/forms';
import { toStoredTemperature, toStoredWeight } from '$lib/units';
import { fieldIsVisible } from '$lib/fields';

export const load: PageServerLoad = ({ params }) => {
  const shot = getShot(params.id);
  if (!shot) throw error(404, 'Shot not found');

  const coffee = getCoffee(shot.coffeeId);

  return {
    shot,
    coffee,
    coffees: listCoffees(),
    fieldConfig: getFieldVisibilityConfig(),
    customFields: listCustomFields('shot'),
    customFieldValues: getCustomFieldValues(params.id)
  };
};

export const actions = {
  update: async ({ request, params }) => {
    const formData = await request.formData();
    const unitSystem = getUnitSystem();
    const fieldConfig = getFieldVisibilityConfig();
    const shot = getShot(params.id);
    if (!shot) throw error(404, 'Shot not found');
    const customFields = listCustomFields('shot');

    try {
      updateShot(params.id, {
        coffeeId: requiredString(formData, 'coffeeId'),
        pulledAt: fieldIsVisible(fieldConfig, 'shot', 'pulledAt') ? parseDateTime(formData, 'pulledAt') : shot.pulledAt,
        drinkType: requiredString(formData, 'drinkType'),
        doseGrams: fieldIsVisible(fieldConfig, 'shot', 'dose') ? toStoredWeight(optionalNumber(formData, 'dose'), unitSystem) : shot.doseGrams,
        yieldGrams: fieldIsVisible(fieldConfig, 'shot', 'yield') ? toStoredWeight(optionalNumber(formData, 'yield'), unitSystem) : shot.yieldGrams,
        shotTimeSeconds: fieldIsVisible(fieldConfig, 'shot', 'shotTimeSeconds') ? optionalNumber(formData, 'shotTimeSeconds') : shot.shotTimeSeconds,
        grindSize: fieldIsVisible(fieldConfig, 'shot', 'grindSize') ? optionalString(formData, 'grindSize') : shot.grindSize,
        grindTimeSeconds: fieldIsVisible(fieldConfig, 'shot', 'grindTimeSeconds')
          ? optionalNumber(formData, 'grindTimeSeconds')
          : shot.grindTimeSeconds,
        temperatureC: fieldIsVisible(fieldConfig, 'shot', 'temperature')
          ? toStoredTemperature(optionalNumber(formData, 'temperature'), unitSystem)
          : shot.temperatureC,
        rating: fieldIsVisible(fieldConfig, 'shot', 'rating') ? optionalInteger(formData, 'rating') : shot.rating,
        tasteNotes: fieldIsVisible(fieldConfig, 'shot', 'tasteNotes') ? optionalString(formData, 'tasteNotes') : shot.tasteNotes,
        machineNotes: fieldIsVisible(fieldConfig, 'shot', 'machineNotes') ? optionalString(formData, 'machineNotes') : shot.machineNotes,
        resultNotes: fieldIsVisible(fieldConfig, 'shot', 'resultNotes') ? optionalString(formData, 'resultNotes') : shot.resultNotes
      });
      setCustomFieldValues(params.id, parseCustomFieldValues(formData, customFields));

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

function parseCustomFieldValues(formData: FormData, customFields: ReturnType<typeof listCustomFields>) {
  return Object.fromEntries(
    customFields
      .filter((field) => field.visibility !== 'hidden')
      .map((field) => [`${field.id}`, optionalString(formData, `custom:${field.id}`)])
  );
}
