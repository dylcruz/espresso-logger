import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';
import {
  deleteCoffee,
  getCoffee,
  getCustomFieldValues,
  listCustomFields,
  listShotsForCoffee,
  setCustomFieldValues,
  updateCoffee
} from '$lib/server/db';
import { optionalCheckbox, optionalString, requiredString } from '$lib/server/forms';
import { fieldIsVisible } from '$lib/fields';
import { getFieldVisibilityConfig } from '$lib/server/settings';

export const load: PageServerLoad = ({ params }) => {
  const coffee = getCoffee(params.id);
  if (!coffee) throw error(404, 'Coffee not found');

  return {
    coffee,
    shots: listShotsForCoffee(params.id),
    fieldConfig: getFieldVisibilityConfig(),
    customFields: listCustomFields('coffee'),
    customFieldValues: getCustomFieldValues(params.id)
  };
};

export const actions = {
  update: async ({ request, params }) => {
    const formData = await request.formData();
    const fieldConfig = getFieldVisibilityConfig();
    const coffee = getCoffee(params.id);
    if (!coffee) throw error(404, 'Coffee not found');
    const customFields = listCustomFields('coffee');

    try {
      updateCoffee(params.id, {
        brand: requiredString(formData, 'brand'),
        blend: requiredString(formData, 'blend'),
        showOnLog: fieldIsVisible(fieldConfig, 'coffee', 'showOnLog') ? optionalCheckbox(formData, 'showOnLog') : coffee.showOnLog,
        roastLevel: fieldIsVisible(fieldConfig, 'coffee', 'roastLevel') ? optionalString(formData, 'roastLevel') : coffee.roastLevel,
        roastDate: fieldIsVisible(fieldConfig, 'coffee', 'roastDate') ? optionalString(formData, 'roastDate') : coffee.roastDate,
        origin: fieldIsVisible(fieldConfig, 'coffee', 'origin') ? optionalString(formData, 'origin') : coffee.origin,
        process: fieldIsVisible(fieldConfig, 'coffee', 'process') ? optionalString(formData, 'process') : coffee.process,
        notes: fieldIsVisible(fieldConfig, 'coffee', 'notes') ? optionalString(formData, 'notes') : coffee.notes
      });
      setCustomFieldValues(params.id, parseCustomFieldValues(formData, customFields));

      return { saved: true };
    } catch (error) {
      return fail(400, { error: error instanceof Error ? error.message : 'Could not update coffee' });
    }
  },
  delete: async ({ params }) => {
    deleteCoffee(params.id);
    throw redirect(303, '/coffees');
  }
} satisfies Actions;

function parseCustomFieldValues(formData: FormData, customFields: ReturnType<typeof listCustomFields>) {
  return Object.fromEntries(
    customFields
      .filter((field) => field.visibility !== 'hidden')
      .map((field) => [`${field.id}`, optionalString(formData, `custom:${field.id}`)])
  );
}
