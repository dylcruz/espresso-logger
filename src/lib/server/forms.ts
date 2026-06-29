export function requiredString(formData: FormData, key: string) {
  const value = optionalString(formData, key);
  if (!value) throw new Error(`${key} is required`);
  return value;
}

export function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function optionalNumber(formData: FormData, key: string) {
  const value = optionalString(formData, key);
  if (value == null) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`${key} must be a number`);
  return parsed;
}

export function optionalInteger(formData: FormData, key: string) {
  const value = optionalNumber(formData, key);
  if (value == null) return null;
  return Math.trunc(value);
}

export function parseDateTime(formData: FormData, key: string) {
  const value = optionalString(formData, key);
  if (!value) return Date.now();
  const parsed = new Date(value).getTime();
  if (!Number.isFinite(parsed)) throw new Error(`${key} must be a date and time`);
  return parsed;
}
