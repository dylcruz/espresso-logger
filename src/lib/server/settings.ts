import { normalizeFieldVisibilityConfig, type FieldVisibilityConfig } from '$lib/fields';
import type { UnitSystem } from '$lib/units';
import { getSetting, setSetting } from './db';

const fieldVisibilityKey = 'field_visibility';

export function getUnitSystem(): UnitSystem {
  const row = getSetting('unit_system');
  return row?.value === 'imperial' ? 'imperial' : 'metric';
}

export function setUnitSystem(unitSystem: UnitSystem) {
  setSetting('unit_system', unitSystem);
}

export function getFieldVisibilityConfig(): FieldVisibilityConfig {
  const row = getSetting(fieldVisibilityKey);
  if (!row) return normalizeFieldVisibilityConfig(null);

  try {
    return normalizeFieldVisibilityConfig(JSON.parse(row.value));
  } catch {
    return normalizeFieldVisibilityConfig(null);
  }
}

export function setFieldVisibilityConfig(config: FieldVisibilityConfig) {
  setSetting(fieldVisibilityKey, JSON.stringify(normalizeFieldVisibilityConfig(config)));
}
