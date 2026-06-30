import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';
// @ts-ignore Node 26 provides node:sqlite; some TypeScript Node declarations lag behind it.
import { DatabaseSync } from 'node:sqlite';
import type { CustomField, CustomFieldInputType, FieldModel, FieldVisibility } from '$lib/fields';
import type { Coffee, RecentShot, Shot } from './schema';

const databasePath = getDatabasePath();
mkdirSync(dirname(databasePath), { recursive: true });

const sqlite = new DatabaseSync(databasePath);
sqlite.exec('PRAGMA journal_mode = WAL');
sqlite.exec('PRAGMA foreign_keys = ON');

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS coffees (
    id TEXT PRIMARY KEY,
    brand TEXT NOT NULL,
    blend TEXT NOT NULL,
    show_on_log INTEGER NOT NULL DEFAULT 1,
    roast_level TEXT,
    roast_date TEXT,
    origin TEXT,
    process TEXT,
    notes TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS shots (
    id TEXT PRIMARY KEY,
    coffee_id TEXT NOT NULL REFERENCES coffees(id) ON DELETE CASCADE,
    pulled_at INTEGER NOT NULL,
    drink_type TEXT NOT NULL,
    dose_grams REAL,
    yield_grams REAL,
    shot_time_seconds REAL,
    grind_size TEXT,
    grind_time_seconds REAL,
    temperature_c REAL,
    rating INTEGER,
    taste_notes TEXT,
    machine_notes TEXT,
    result_notes TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS custom_fields (
    id TEXT PRIMARY KEY,
    model TEXT NOT NULL CHECK (model IN ('coffee', 'shot')),
    label TEXT NOT NULL,
    input_type TEXT NOT NULL CHECK (input_type IN ('text', 'number', 'date', 'textarea')),
    visibility TEXT NOT NULL CHECK (visibility IN ('main', 'extras', 'hidden')),
    sort_order INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS custom_field_values (
    field_id TEXT NOT NULL REFERENCES custom_fields(id) ON DELETE CASCADE,
    entity_id TEXT NOT NULL,
    value TEXT NOT NULL,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (field_id, entity_id)
  );

  CREATE INDEX IF NOT EXISTS shots_coffee_id_idx ON shots(coffee_id);
  CREATE INDEX IF NOT EXISTS shots_pulled_at_idx ON shots(pulled_at);
  CREATE INDEX IF NOT EXISTS custom_fields_model_idx ON custom_fields(model, sort_order);
  CREATE INDEX IF NOT EXISTS custom_field_values_entity_id_idx ON custom_field_values(entity_id);
`);

if (!columnExists('coffees', 'show_on_log')) {
  sqlite.exec('ALTER TABLE coffees ADD COLUMN show_on_log INTEGER NOT NULL DEFAULT 1');
}

sqlite.prepare('INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES (?, ?, ?)').run('unit_system', 'metric', Date.now());

const coffeeSelect = `
  id,
  brand,
  blend,
  show_on_log AS showOnLog,
  roast_level AS roastLevel,
  roast_date AS roastDate,
  origin,
  process,
  notes,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

const customFieldSelect = `
  id,
  model,
  label,
  input_type AS inputType,
  visibility,
  sort_order AS sortOrder,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

const shotSelect = `
  id,
  coffee_id AS coffeeId,
  pulled_at AS pulledAt,
  drink_type AS drinkType,
  dose_grams AS doseGrams,
  yield_grams AS yieldGrams,
  shot_time_seconds AS shotTimeSeconds,
  grind_size AS grindSize,
  grind_time_seconds AS grindTimeSeconds,
  temperature_c AS temperatureC,
  rating,
  taste_notes AS tasteNotes,
  machine_notes AS machineNotes,
  result_notes AS resultNotes,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

type CoffeeInput = Omit<Coffee, 'createdAt' | 'updatedAt'>;
type CoffeeUpdate = Omit<Coffee, 'id' | 'createdAt' | 'updatedAt'>;
type ShotInput = Omit<Shot, 'createdAt' | 'updatedAt'>;
type ShotUpdate = Omit<Shot, 'id' | 'createdAt' | 'updatedAt'>;

export function listCoffees() {
  return (sqlite.prepare(`SELECT ${coffeeSelect} FROM coffees ORDER BY brand ASC, blend ASC`).all() as CoffeeRow[]).map(mapCoffee);
}

export function listCoffeesForShotMenu() {
  return (sqlite.prepare(`SELECT ${coffeeSelect} FROM coffees WHERE show_on_log = 1 ORDER BY brand ASC, blend ASC`).all() as CoffeeRow[]).map(
    mapCoffee
  );
}

export function getCoffee(id: string) {
  const row = sqlite.prepare(`SELECT ${coffeeSelect} FROM coffees WHERE id = ?`).get(id) as CoffeeRow | undefined;
  return row ? mapCoffee(row) : undefined;
}

export function createCoffee(coffee: CoffeeInput) {
  const now = Date.now();
  sqlite
    .prepare(
      `INSERT INTO coffees (id, brand, blend, show_on_log, roast_level, roast_date, origin, process, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      coffee.id,
      coffee.brand,
      coffee.blend,
      coffee.showOnLog ? 1 : 0,
      coffee.roastLevel,
      coffee.roastDate,
      coffee.origin,
      coffee.process,
      coffee.notes,
      now,
      now
    );
}

export function updateCoffee(id: string, coffee: CoffeeUpdate) {
  sqlite
    .prepare(
      `UPDATE coffees
       SET brand = ?, blend = ?, show_on_log = ?, roast_level = ?, roast_date = ?, origin = ?, process = ?, notes = ?, updated_at = ?
       WHERE id = ?`
    )
    .run(
      coffee.brand,
      coffee.blend,
      coffee.showOnLog ? 1 : 0,
      coffee.roastLevel,
      coffee.roastDate,
      coffee.origin,
      coffee.process,
      coffee.notes,
      Date.now(),
      id
    );
}

export function deleteCoffee(id: string) {
  const shotIds = sqlite.prepare('SELECT id FROM shots WHERE coffee_id = ?').all(id) as { id: string }[];
  for (const shot of shotIds) {
    sqlite.prepare('DELETE FROM custom_field_values WHERE entity_id = ?').run(shot.id);
  }
  sqlite.prepare('DELETE FROM custom_field_values WHERE entity_id = ?').run(id);
  sqlite.prepare('DELETE FROM coffees WHERE id = ?').run(id);
}

export function getShot(id: string) {
  return sqlite.prepare(`SELECT ${shotSelect} FROM shots WHERE id = ?`).get(id) as Shot | undefined;
}

export function listShotsForCoffee(coffeeId: string) {
  return sqlite.prepare(`SELECT ${shotSelect} FROM shots WHERE coffee_id = ? ORDER BY pulled_at DESC`).all(coffeeId) as Shot[];
}

export function listRecentShots() {
  return sqlite
    .prepare(
      `SELECT
        shots.id,
        shots.pulled_at AS pulledAt,
        shots.drink_type AS drinkType,
        shots.dose_grams AS doseGrams,
        shots.yield_grams AS yieldGrams,
        shots.shot_time_seconds AS shotTimeSeconds,
        shots.rating,
        coffees.brand AS coffeeBrand,
        coffees.blend AS coffeeBlend
       FROM shots
       LEFT JOIN coffees ON shots.coffee_id = coffees.id
       ORDER BY shots.pulled_at DESC
       LIMIT 8`
    )
    .all() as RecentShot[];
}

export function createShot(shot: ShotInput) {
  const now = Date.now();
  sqlite
    .prepare(
      `INSERT INTO shots (
        id, coffee_id, pulled_at, drink_type, dose_grams, yield_grams, shot_time_seconds,
        grind_size, grind_time_seconds, temperature_c, rating, taste_notes, machine_notes,
        result_notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      shot.id,
      shot.coffeeId,
      shot.pulledAt,
      shot.drinkType,
      shot.doseGrams,
      shot.yieldGrams,
      shot.shotTimeSeconds,
      shot.grindSize,
      shot.grindTimeSeconds,
      shot.temperatureC,
      shot.rating,
      shot.tasteNotes,
      shot.machineNotes,
      shot.resultNotes,
      now,
      now
    );
}

export function updateShot(id: string, shot: ShotUpdate) {
  sqlite
    .prepare(
      `UPDATE shots
       SET coffee_id = ?, pulled_at = ?, drink_type = ?, dose_grams = ?, yield_grams = ?,
        shot_time_seconds = ?, grind_size = ?, grind_time_seconds = ?, temperature_c = ?,
        rating = ?, taste_notes = ?, machine_notes = ?, result_notes = ?, updated_at = ?
       WHERE id = ?`
    )
    .run(
      shot.coffeeId,
      shot.pulledAt,
      shot.drinkType,
      shot.doseGrams,
      shot.yieldGrams,
      shot.shotTimeSeconds,
      shot.grindSize,
      shot.grindTimeSeconds,
      shot.temperatureC,
      shot.rating,
      shot.tasteNotes,
      shot.machineNotes,
      shot.resultNotes,
      Date.now(),
      id
    );
}

export function deleteShot(id: string) {
  sqlite.prepare('DELETE FROM custom_field_values WHERE entity_id = ?').run(id);
  sqlite.prepare('DELETE FROM shots WHERE id = ?').run(id);
}

export function getCoffeeCount() {
  return (sqlite.prepare('SELECT count(*) AS value FROM coffees').get() as { value: number }).value;
}

export function getShotCount() {
  return (sqlite.prepare('SELECT count(*) AS value FROM shots').get() as { value: number }).value;
}

export function getBestShotRating() {
  return (sqlite.prepare('SELECT max(rating) AS value FROM shots').get() as { value: number | null }).value;
}

export function getSetting(key: string) {
  return sqlite.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
}

export function setSetting(key: string, value: string) {
  sqlite
    .prepare(
      `INSERT INTO settings (key, value, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    )
    .run(key, value, Date.now());
}

export function listCustomFields(model?: FieldModel) {
  const statement = model
    ? sqlite.prepare(`SELECT ${customFieldSelect} FROM custom_fields WHERE model = ? ORDER BY sort_order ASC, created_at ASC`)
    : sqlite.prepare(`SELECT ${customFieldSelect} FROM custom_fields ORDER BY model ASC, sort_order ASC, created_at ASC`);

  return (model ? statement.all(model) : statement.all()) as CustomField[];
}

export function createCustomField(field: {
  id: string;
  model: FieldModel;
  label: string;
  inputType: CustomFieldInputType;
  visibility: FieldVisibility;
}) {
  const now = Date.now();
  const sortOrder = (sqlite.prepare('SELECT coalesce(max(sort_order), 0) + 1 AS value FROM custom_fields WHERE model = ?').get(field.model) as {
    value: number;
  }).value;

  sqlite
    .prepare(
      `INSERT INTO custom_fields (id, model, label, input_type, visibility, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(field.id, field.model, field.label, field.inputType, field.visibility, sortOrder, now, now);
}

export function updateCustomFieldVisibility(id: string, visibility: FieldVisibility) {
  sqlite.prepare('UPDATE custom_fields SET visibility = ?, updated_at = ? WHERE id = ?').run(visibility, Date.now(), id);
}

export function getCustomFieldValues(entityId: string) {
  const rows = sqlite.prepare('SELECT field_id AS fieldId, value FROM custom_field_values WHERE entity_id = ?').all(entityId) as {
    fieldId: string;
    value: string;
  }[];

  return Object.fromEntries(rows.map((row) => [row.fieldId, row.value])) as Record<string, string>;
}

export function setCustomFieldValues(entityId: string, values: Record<string, string | null>) {
  const now = Date.now();

  for (const [fieldId, value] of Object.entries(values)) {
    if (value == null) {
      sqlite.prepare('DELETE FROM custom_field_values WHERE field_id = ? AND entity_id = ?').run(fieldId, entityId);
      continue;
    }

    sqlite
      .prepare(
        `INSERT INTO custom_field_values (field_id, entity_id, value, updated_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(field_id, entity_id) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
      )
      .run(fieldId, entityId, value, now);
  }
}

type CoffeeRow = Omit<Coffee, 'showOnLog'> & { showOnLog: number };

function mapCoffee(row: CoffeeRow): Coffee {
  return {
    ...row,
    showOnLog: Boolean(row.showOnLog)
  };
}

function columnExists(table: 'coffees', column: string) {
  return (sqlite.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]).some((row) => row.name === column);
}

function getDatabasePath() {
  const databaseUrl = process.env.DATABASE_URL ?? 'file:./data/espresso.db';
  const withoutFilePrefix = databaseUrl.startsWith('file:') ? databaseUrl.slice(5) : databaseUrl;
  return resolve(withoutFilePrefix);
}
