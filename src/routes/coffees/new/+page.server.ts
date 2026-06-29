import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createCoffee } from '$lib/server/db';
import { optionalString, requiredString } from '$lib/server/forms';

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const id = crypto.randomUUID();

    try {
      createCoffee({
        id,
        brand: requiredString(formData, 'brand'),
        blend: requiredString(formData, 'blend'),
        roastLevel: optionalString(formData, 'roastLevel'),
        roastDate: optionalString(formData, 'roastDate'),
        origin: optionalString(formData, 'origin'),
        process: optionalString(formData, 'process'),
        notes: optionalString(formData, 'notes')
      });
    } catch (error) {
      return fail(400, { error: error instanceof Error ? error.message : 'Could not save coffee' });
    }

    throw redirect(303, `/coffees/${id}`);
  }
} satisfies Actions;
