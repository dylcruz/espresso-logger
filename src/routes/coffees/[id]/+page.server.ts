import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';
import { deleteCoffee, getCoffee, listShotsForCoffee, updateCoffee } from '$lib/server/db';
import { optionalString, requiredString } from '$lib/server/forms';

export const load: PageServerLoad = ({ params }) => {
  const coffee = getCoffee(params.id);
  if (!coffee) throw error(404, 'Coffee not found');

  return {
    coffee,
    shots: listShotsForCoffee(params.id)
  };
};

export const actions = {
  update: async ({ request, params }) => {
    const formData = await request.formData();

    try {
      updateCoffee(params.id, {
        brand: requiredString(formData, 'brand'),
        blend: requiredString(formData, 'blend'),
        roastLevel: optionalString(formData, 'roastLevel'),
        roastDate: optionalString(formData, 'roastDate'),
        origin: optionalString(formData, 'origin'),
        process: optionalString(formData, 'process'),
        notes: optionalString(formData, 'notes')
      });

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
