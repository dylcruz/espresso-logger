<script lang="ts">
  import { getFieldVisibility, hasExtras } from '$lib/fields';
  import { displayWeight, formatDateTime } from '$lib/units';

  let { data, form } = $props();

  const fieldIs = (name: string, visibility: 'main' | 'extras') => getFieldVisibility(data.fieldConfig, 'coffee', name) === visibility;
  const fieldVisible = (name: string) => getFieldVisibility(data.fieldConfig, 'coffee', name) !== 'hidden';
  const customFields = (visibility: 'main' | 'extras') => data.customFields.filter((field) => field.visibility === visibility);
  const customValue = (id: string) => data.customFieldValues[id] ?? '';
</script>

<div class="page-title">
  <div>
    <h1>{data.coffee.brand}</h1>
    <p>{data.coffee.blend}</p>
  </div>
  {#if data.coffee.showOnLog}<a class="button" href={`/shots/new?coffee=${data.coffee.id}`}>Log shot</a>{/if}
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if form?.saved}<p class="card">Coffee saved.</p>{/if}

<section class="grid two">
  <form method="POST" action="?/update" class="card form-grid">
    {#if fieldIs('brand', 'main')}<label>Brand <input name="brand" required value={data.coffee.brand} /></label>{/if}
    {#if fieldIs('blend', 'main')}<label>Blend/name <input name="blend" required value={data.coffee.blend} /></label>{/if}
    {#if fieldIs('showOnLog', 'main')}
      <label class="checkbox-label full"><input name="showOnLog" type="checkbox" checked={data.coffee.showOnLog} /> Show on Log shot menu</label>
    {/if}
    {#if fieldIs('roastLevel', 'main')}<label>Roast level <input name="roastLevel" value={data.coffee.roastLevel ?? ''} /></label>{/if}
    {#if fieldIs('roastDate', 'main')}<label>Roast date <input name="roastDate" type="date" value={data.coffee.roastDate ?? ''} /></label>{/if}
    {#if fieldIs('origin', 'main')}<label>Origin <input name="origin" value={data.coffee.origin ?? ''} /></label>{/if}
    {#if fieldIs('process', 'main')}<label>Process <input name="process" value={data.coffee.process ?? ''} /></label>{/if}
    {#if fieldIs('notes', 'main')}<label class="full">Notes <textarea name="notes" value={data.coffee.notes ?? ''}></textarea></label>{/if}
    {#each customFields('main') as field}
      <label class:full={field.inputType === 'textarea'}>
        {field.label}
        {#if field.inputType === 'textarea'}
          <textarea name={`custom:${field.id}`} value={customValue(field.id)}></textarea>
        {:else}
          <input name={`custom:${field.id}`} type={field.inputType} value={customValue(field.id)} />
        {/if}
      </label>
    {/each}
    {#if hasExtras(data.fieldConfig, 'coffee', data.customFields)}
      <details class="extras full">
        <summary>Extras</summary>
        <div class="form-grid">
          {#if fieldIs('brand', 'extras')}<label>Brand <input name="brand" required value={data.coffee.brand} /></label>{/if}
          {#if fieldIs('blend', 'extras')}<label>Blend/name <input name="blend" required value={data.coffee.blend} /></label>{/if}
          {#if fieldIs('showOnLog', 'extras')}
            <label class="checkbox-label full"><input name="showOnLog" type="checkbox" checked={data.coffee.showOnLog} /> Show on Log shot menu</label>
          {/if}
          {#if fieldIs('roastLevel', 'extras')}<label>Roast level <input name="roastLevel" value={data.coffee.roastLevel ?? ''} /></label>{/if}
          {#if fieldIs('roastDate', 'extras')}<label>Roast date <input name="roastDate" type="date" value={data.coffee.roastDate ?? ''} /></label>{/if}
          {#if fieldIs('origin', 'extras')}<label>Origin <input name="origin" value={data.coffee.origin ?? ''} /></label>{/if}
          {#if fieldIs('process', 'extras')}<label>Process <input name="process" value={data.coffee.process ?? ''} /></label>{/if}
          {#if fieldIs('notes', 'extras')}<label class="full">Notes <textarea name="notes" value={data.coffee.notes ?? ''}></textarea></label>{/if}
          {#each customFields('extras') as field}
            <label class:full={field.inputType === 'textarea'}>
              {field.label}
              {#if field.inputType === 'textarea'}
                <textarea name={`custom:${field.id}`} value={customValue(field.id)}></textarea>
              {:else}
                <input name={`custom:${field.id}`} type={field.inputType} value={customValue(field.id)} />
              {/if}
            </label>
          {/each}
        </div>
      </details>
    {/if}
    <div class="actions full">
      <button type="submit">Save changes</button>
    </div>
  </form>

  <div class="card">
    <h2>Profile</h2>
    {#if fieldVisible('showOnLog')}<p><strong>Log shot menu:</strong> {data.coffee.showOnLog ? 'Shown' : 'Hidden'}</p>{/if}
    {#if fieldVisible('roastLevel')}<p><strong>Roast:</strong> {data.coffee.roastLevel ?? '-'}</p>{/if}
    {#if fieldVisible('origin')}<p><strong>Origin:</strong> {data.coffee.origin ?? '-'}</p>{/if}
    {#if fieldVisible('process')}<p><strong>Process:</strong> {data.coffee.process ?? '-'}</p>{/if}
    {#each data.customFields.filter((field) => field.visibility !== 'hidden') as field}
      <p><strong>{field.label}:</strong> {customValue(field.id) || '-'}</p>
    {/each}
    <form method="POST" action="?/delete">
      <button class="danger" type="submit">Delete coffee and shots</button>
    </form>
  </div>
</section>

<div class="section-title">
  <h2>Shot history</h2>
</div>

<section class="table-card">
  {#if data.shots.length === 0}
    <p class="empty">No shots logged for this coffee yet.</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>When</th>
          <th>Drink</th>
          <th>Recipe</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        {#each data.shots as shot}
          <tr>
            <td><a href={`/shots/${shot.id}`}>{formatDateTime(shot.pulledAt)}</a></td>
            <td><span class="pill">{shot.drinkType}</span></td>
            <td>
              {displayWeight(shot.doseGrams, data.unitSystem)} in / {displayWeight(
                shot.yieldGrams,
                data.unitSystem
              )} out, {shot.shotTimeSeconds ?? '-'}s
            </td>
            <td>{shot.rating ? `${shot.rating}/10` : '-'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</section>
