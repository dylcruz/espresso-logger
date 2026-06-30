import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createShot, listCoffeesForShotMenu, listCustomFields, setCustomFieldValues } from '$lib/server/db';
import { getFieldVisibilityConfig, getUnitSystem } from '$lib/server/settings';
import { optionalInteger, optionalNumber, optionalString, parseDateTime, requiredString } from '$lib/server/forms';
import { toStoredTemperature, toStoredWeight } from '$lib/units';
import { fieldIsVisible } from '$lib/fields';

export const load: PageServerLoad = ({ url }) => {
  return {
    coffees: listCoffeesForShotMenu(),
    selectedCoffeeId: url.searchParams.get('coffee'),
    fieldConfig: getFieldVisibilityConfig(),
    customFields: listCustomFields('shot')
  };
};

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const unitSystem = getUnitSystem();
    const fieldConfig = getFieldVisibilityConfig();
    const customFields = listCustomFields('shot');
    const id = crypto.randomUUID();

    try {
      createShot({
        id,
        coffeeId: requiredString(formData, 'coffeeId'),
        pulledAt: fieldIsVisible(fieldConfig, 'shot', 'pulledAt') ? parseDateTime(formData, 'pulledAt') : Date.now(),
        drinkType: requiredString(formData, 'drinkType'),
        doseGrams: fieldIsVisible(fieldConfig, 'shot', 'dose') ? toStoredWeight(optionalNumber(formData, 'dose'), unitSystem) : null,
        yieldGrams: fieldIsVisible(fieldConfig, 'shot', 'yield') ? toStoredWeight(optionalNumber(formData, 'yield'), unitSystem) : null,
        shotTimeSeconds: fieldIsVisible(fieldConfig, 'shot', 'shotTimeSeconds') ? optionalNumber(formData, 'shotTimeSeconds') : null,
        grindSize: fieldIsVisible(fieldConfig, 'shot', 'grindSize') ? optionalString(formData, 'grindSize') : null,
        grindTimeSeconds: fieldIsVisible(fieldConfig, 'shot', 'grindTimeSeconds') ? optionalNumber(formData, 'grindTimeSeconds') : null,
        temperatureC: fieldIsVisible(fieldConfig, 'shot', 'temperature')
          ? toStoredTemperature(optionalNumber(formData, 'temperature'), unitSystem)
          : null,
        rating: fieldIsVisible(fieldConfig, 'shot', 'rating') ? optionalInteger(formData, 'rating') : null,
        tasteNotes: fieldIsVisible(fieldConfig, 'shot', 'tasteNotes') ? optionalString(formData, 'tasteNotes') : null,
        machineNotes: fieldIsVisible(fieldConfig, 'shot', 'machineNotes') ? optionalString(formData, 'machineNotes') : null,
        resultNotes: fieldIsVisible(fieldConfig, 'shot', 'resultNotes') ? optionalString(formData, 'resultNotes') : null
      });
      setCustomFieldValues(id, parseCustomFieldValues(formData, customFields));
    } catch (error) {
      return fail(400, { error: error instanceof Error ? error.message : 'Could not save shot' });
    }

    throw redirect(303, `/shots/${id}`);
  }
} satisfies Actions;

function parseCustomFieldValues(formData: FormData, customFields: ReturnType<typeof listCustomFields>) {
  return Object.fromEntries(
    customFields
      .filter((field) => field.visibility !== 'hidden')
      .map((field) => [`${field.id}`, optionalString(formData, `custom:${field.id}`)])
  );
}
