export type UnitSystem = 'metric' | 'imperial';

const GRAMS_PER_OUNCE = 28.349523125;

export function displayWeight(valueInGrams: number | null | undefined, unitSystem: UnitSystem) {
  if (valueInGrams == null) return '';
  return unitSystem === 'imperial'
    ? `${formatNumber(valueInGrams / GRAMS_PER_OUNCE)} oz`
    : `${formatNumber(valueInGrams)} g`;
}

export function displayTemperature(valueInCelsius: number | null | undefined, unitSystem: UnitSystem) {
  if (valueInCelsius == null) return '';
  return unitSystem === 'imperial'
    ? `${formatNumber((valueInCelsius * 9) / 5 + 32, 0)} F`
    : `${formatNumber(valueInCelsius, 0)} C`;
}

export function weightLabel(unitSystem: UnitSystem) {
  return unitSystem === 'imperial' ? 'oz' : 'g';
}

export function temperatureLabel(unitSystem: UnitSystem) {
  return unitSystem === 'imperial' ? 'F' : 'C';
}

export function toStoredWeight(value: number | null, unitSystem: UnitSystem) {
  if (value == null) return null;
  return unitSystem === 'imperial' ? value * GRAMS_PER_OUNCE : value;
}

export function fromStoredWeight(valueInGrams: number | null | undefined, unitSystem: UnitSystem) {
  if (valueInGrams == null) return '';
  return formatNumber(unitSystem === 'imperial' ? valueInGrams / GRAMS_PER_OUNCE : valueInGrams);
}

export function toStoredTemperature(value: number | null, unitSystem: UnitSystem) {
  if (value == null) return null;
  return unitSystem === 'imperial' ? ((value - 32) * 5) / 9 : value;
}

export function fromStoredTemperature(valueInCelsius: number | null | undefined, unitSystem: UnitSystem) {
  if (valueInCelsius == null) return '';
  return formatNumber(unitSystem === 'imperial' ? (valueInCelsius * 9) / 5 + 32 : valueInCelsius, 0);
}

export function formatDate(value: number | string | Date | null | undefined) {
  if (!value) return '';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(`${value}T00:00`));
  }
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
}

export function formatDateTime(value: number | string | Date | null | undefined) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function toDateTimeInput(value: number | null | undefined) {
  const date = value ? new Date(value) : new Date();
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function formatNumber(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat('en', { maximumFractionDigits }).format(value);
}
