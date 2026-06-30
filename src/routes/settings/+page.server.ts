import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import {
  builtInFieldsByModel,
  fieldModels,
  isCustomFieldInputType,
  isFieldModel,
  normalizeFieldVisibility,
  type FieldVisibilityConfig
} from '$lib/fields';
import type { UnitSystem } from '$lib/units';
import { createCustomField, listCustomFields, updateCustomFieldVisibility } from '$lib/server/db';
import { optionalString, requiredString } from '$lib/server/forms';
import { getFieldVisibilityConfig, getUnitSystem, setFieldVisibilityConfig, setUnitSystem } from '$lib/server/settings';

export const load: PageServerLoad = () => {
  return {
    unitSystem: getUnitSystem(),
    fieldConfig: getFieldVisibilityConfig(),
    customFields: listCustomFields()
  };
};

export const actions = {
  save: async ({ request }) => {
    const formData = await request.formData();
    const unitSystem = formData.get('unitSystem');

    if (unitSystem !== 'metric' && unitSystem !== 'imperial') {
      return fail(400, { error: 'Choose metric or imperial units' });
    }

    setUnitSystem(unitSystem as UnitSystem);
    setFieldVisibilityConfig(parseFieldVisibilityConfig(formData));

    for (const field of listCustomFields()) {
      const visibility = formData.get(`customField:${field.id}`);
      updateCustomFieldVisibility(field.id, normalizeFieldVisibility(visibility));
    }

    return { saved: true };
  },
  addCustomField: async ({ request }) => {
    const formData = await request.formData();
    const model = formData.get('model');
    const inputType = formData.get('inputType');

    if (!isFieldModel(model)) return fail(400, { error: 'Choose coffee or shot for the custom field' });
    if (!isCustomFieldInputType(inputType)) return fail(400, { error: 'Choose a valid custom field type' });

    try {
      createCustomField({
        id: crypto.randomUUID(),
        model,
        label: requiredString(formData, 'label'),
        inputType,
        visibility: normalizeFieldVisibility(optionalString(formData, 'visibility'))
      });
    } catch (error) {
      return fail(400, { error: error instanceof Error ? error.message : 'Could not add custom field' });
    }

    return { saved: true };
  }
} satisfies Actions;

function parseFieldVisibilityConfig(formData: FormData): FieldVisibilityConfig {
  const config = getFieldVisibilityConfig();

  for (const model of fieldModels) {
    for (const field of builtInFieldsByModel[model]) {
      config[model][field.name] = normalizeFieldVisibility(formData.get(`field:${model}:${field.name}`), field);
    }
  }

  return config;
}
