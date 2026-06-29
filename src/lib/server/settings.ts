import type { UnitSystem } from '$lib/units';
import { getSetting, setSetting } from './db';

export function getUnitSystem(): UnitSystem {
  const row = getSetting('unit_system');
  return row?.value === 'imperial' ? 'imperial' : 'metric';
}

export function setUnitSystem(unitSystem: UnitSystem) {
  setSetting('unit_system', unitSystem);
}
