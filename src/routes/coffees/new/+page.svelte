<script lang="ts">
  import { getFieldVisibility, hasExtras } from '$lib/fields';

  let { data, form } = $props();

  const fieldIs = (name: string, visibility: 'main' | 'extras') => getFieldVisibility(data.fieldConfig, 'coffee', name) === visibility;
  const customFields = (visibility: 'main' | 'extras') => data.customFields.filter((field) => field.visibility === visibility);
</script>

<div class="page-title">
  <div>
    <h1>Add coffee</h1>
    <p>Record a brand and blend before logging shots.</p>
  </div>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}

<form method="POST" class="card form-grid">
  {#if fieldIs('brand', 'main')}<label>Brand <input name="brand" required /></label>{/if}
  {#if fieldIs('blend', 'main')}<label>Blend/name <input name="blend" required /></label>{/if}
  {#if fieldIs('showOnLog', 'main')}
    <label class="checkbox-label full"><input name="showOnLog" type="checkbox" checked /> Show on Log shot menu</label>
  {/if}
  {#if fieldIs('roastLevel', 'main')}<label>Roast level <input name="roastLevel" placeholder="Medium" /></label>{/if}
  {#if fieldIs('roastDate', 'main')}<label>Roast date <input name="roastDate" type="date" /></label>{/if}
  {#if fieldIs('origin', 'main')}<label>Origin <input name="origin" placeholder="Colombia, Ethiopia..." /></label>{/if}
  {#if fieldIs('process', 'main')}<label>Process <input name="process" placeholder="Washed, natural, honey..." /></label>{/if}
  {#if fieldIs('notes', 'main')}<label class="full">Notes <textarea name="notes"></textarea></label>{/if}
  {#each customFields('main') as field}
    <label class:full={field.inputType === 'textarea'}>
      {field.label}
      {#if field.inputType === 'textarea'}
        <textarea name={`custom:${field.id}`}></textarea>
      {:else}
        <input name={`custom:${field.id}`} type={field.inputType} />
      {/if}
    </label>
  {/each}
  {#if hasExtras(data.fieldConfig, 'coffee', data.customFields)}
    <details class="extras full">
      <summary>Extras</summary>
      <div class="form-grid">
        {#if fieldIs('brand', 'extras')}<label>Brand <input name="brand" required /></label>{/if}
        {#if fieldIs('blend', 'extras')}<label>Blend/name <input name="blend" required /></label>{/if}
        {#if fieldIs('showOnLog', 'extras')}
          <label class="checkbox-label full"><input name="showOnLog" type="checkbox" checked /> Show on Log shot menu</label>
        {/if}
        {#if fieldIs('roastLevel', 'extras')}<label>Roast level <input name="roastLevel" placeholder="Medium" /></label>{/if}
        {#if fieldIs('roastDate', 'extras')}<label>Roast date <input name="roastDate" type="date" /></label>{/if}
        {#if fieldIs('origin', 'extras')}<label>Origin <input name="origin" placeholder="Colombia, Ethiopia..." /></label>{/if}
        {#if fieldIs('process', 'extras')}<label>Process <input name="process" placeholder="Washed, natural, honey..." /></label>{/if}
        {#if fieldIs('notes', 'extras')}<label class="full">Notes <textarea name="notes"></textarea></label>{/if}
        {#each customFields('extras') as field}
          <label class:full={field.inputType === 'textarea'}>
            {field.label}
            {#if field.inputType === 'textarea'}
              <textarea name={`custom:${field.id}`}></textarea>
            {:else}
              <input name={`custom:${field.id}`} type={field.inputType} />
            {/if}
          </label>
        {/each}
      </div>
    </details>
  {/if}
  <div class="actions full">
    <button type="submit">Save coffee</button>
    <a class="button secondary" href="/coffees">Cancel</a>
  </div>
</form>
