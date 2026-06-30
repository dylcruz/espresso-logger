import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createCoffee, listCustomFields, setCustomFieldValues } from '$lib/server/db';
import { optionalCheckbox, optionalString, requiredString } from '$lib/server/forms';
import { fieldIsVisible } from '$lib/fields';
import { getFieldVisibilityConfig } from '$lib/server/settings';

export const load: PageServerLoad = () => {
  return {
    fieldConfig: getFieldVisibilityConfig(),
    customFields: listCustomFields('coffee')
  };
};

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const fieldConfig = getFieldVisibilityConfig();
    const customFields = listCustomFields('coffee');
    const id = crypto.randomUUID();

    try {
      createCoffee({
        id,
        brand: requiredString(formData, 'brand'),
        blend: requiredString(formData, 'blend'),
        showOnLog: fieldIsVisible(fieldConfig, 'coffee', 'showOnLog') ? optionalCheckbox(formData, 'showOnLog') : true,
        roastLevel: fieldIsVisible(fieldConfig, 'coffee', 'roastLevel') ? optionalString(formData, 'roastLevel') : null,
        roastDate: fieldIsVisible(fieldConfig, 'coffee', 'roastDate') ? optionalString(formData, 'roastDate') : null,
        origin: fieldIsVisible(fieldConfig, 'coffee', 'origin') ? optionalString(formData, 'origin') : null,
        process: fieldIsVisible(fieldConfig, 'coffee', 'process') ? optionalString(formData, 'process') : null,
        notes: fieldIsVisible(fieldConfig, 'coffee', 'notes') ? optionalString(formData, 'notes') : null
      });
      setCustomFieldValues(id, parseCustomFieldValues(formData, customFields));
    } catch (error) {
      return fail(400, { error: error instanceof Error ? error.message : 'Could not save coffee' });
    }

    throw redirect(303, `/coffees/${id}`);
  }
} satisfies Actions;

function parseCustomFieldValues(formData: FormData, customFields: ReturnType<typeof listCustomFields>) {
  return Object.fromEntries(
    customFields
      .filter((field) => field.visibility !== 'hidden')
      .map((field) => [`${field.id}`, optionalString(formData, `custom:${field.id}`)])
  );
}
