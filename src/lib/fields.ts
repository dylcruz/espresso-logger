export const fieldModels = ['coffee', 'shot'] as const;
export type FieldModel = (typeof fieldModels)[number];

export const fieldVisibilities = ['main', 'extras', 'hidden'] as const;
export type FieldVisibility = (typeof fieldVisibilities)[number];

export const customFieldInputTypes = ['text', 'number', 'date', 'textarea'] as const;
export type CustomFieldInputType = (typeof customFieldInputTypes)[number];

export type BuiltInField = {
  name: string;
  label: string;
  hideable: boolean;
};

export type CustomField = {
  id: string;
  model: FieldModel;
  label: string;
  inputType: CustomFieldInputType;
  visibility: FieldVisibility;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
};

export type FieldVisibilityConfig = Record<FieldModel, Record<string, FieldVisibility>>;

export const builtInFieldsByModel: Record<FieldModel, BuiltInField[]> = {
  coffee: [
    { name: 'brand', label: 'Brand', hideable: false },
    { name: 'blend', label: 'Blend/name', hideable: false },
    { name: 'showOnLog', label: 'Show on Log shot menu', hideable: true },
    { name: 'roastLevel', label: 'Roast level', hideable: true },
    { name: 'roastDate', label: 'Roast date', hideable: true },
    { name: 'origin', label: 'Origin', hideable: true },
    { name: 'process', label: 'Process', hideable: true },
    { name: 'notes', label: 'Notes', hideable: true }
  ],
  shot: [
    { name: 'coffeeId', label: 'Coffee', hideable: false },
    { name: 'pulledAt', label: 'When', hideable: true },
    { name: 'drinkType', label: 'Drink type', hideable: false },
    { name: 'dose', label: 'Dose in', hideable: true },
    { name: 'yield', label: 'Yield out', hideable: true },
    { name: 'shotTimeSeconds', label: 'Shot time', hideable: true },
    { name: 'grindSize', label: 'Grind size', hideable: true },
    { name: 'grindTimeSeconds', label: 'Grind time', hideable: true },
    { name: 'temperature', label: 'Temperature', hideable: true },
    { name: 'rating', label: 'Rating', hideable: true },
    { name: 'tasteNotes', label: 'Taste notes', hideable: true },
    { name: 'machineNotes', label: 'Machine/settings notes', hideable: true },
    { name: 'resultNotes', label: 'Result notes', hideable: true }
  ]
};

export function getDefaultFieldVisibilityConfig(): FieldVisibilityConfig {
  return {
    coffee: Object.fromEntries(builtInFieldsByModel.coffee.map((field) => [field.name, 'main'])),
    shot: Object.fromEntries(builtInFieldsByModel.shot.map((field) => [field.name, 'main']))
  } as FieldVisibilityConfig;
}

export function normalizeFieldVisibilityConfig(value: unknown): FieldVisibilityConfig {
  const defaults = getDefaultFieldVisibilityConfig();
  if (!value || typeof value !== 'object') return defaults;

  const candidate = value as Partial<Record<FieldModel, Record<string, unknown>>>;

  for (const model of fieldModels) {
    for (const field of builtInFieldsByModel[model]) {
      defaults[model][field.name] = normalizeFieldVisibility(candidate[model]?.[field.name], field);
    }
  }

  return defaults;
}

export function normalizeFieldVisibility(value: unknown, field?: BuiltInField): FieldVisibility {
  if (!fieldVisibilities.includes(value as FieldVisibility)) return 'main';
  if (value === 'hidden' && field && !field.hideable) return 'main';
  return value as FieldVisibility;
}

export function getFieldVisibility(config: FieldVisibilityConfig, model: FieldModel, name: string) {
  return config[model]?.[name] ?? 'main';
}

export function fieldIsVisible(config: FieldVisibilityConfig, model: FieldModel, name: string) {
  return getFieldVisibility(config, model, name) !== 'hidden';
}

export function hasExtras(config: FieldVisibilityConfig, model: FieldModel, customFields: CustomField[] = []) {
  return (
    builtInFieldsByModel[model].some((field) => getFieldVisibility(config, model, field.name) === 'extras') ||
    customFields.some((field) => field.model === model && field.visibility === 'extras')
  );
}

export function isFieldModel(value: unknown): value is FieldModel {
  return fieldModels.includes(value as FieldModel);
}

export function isFieldVisibility(value: unknown): value is FieldVisibility {
  return fieldVisibilities.includes(value as FieldVisibility);
}

export function isCustomFieldInputType(value: unknown): value is CustomFieldInputType {
  return customFieldInputTypes.includes(value as CustomFieldInputType);
}
