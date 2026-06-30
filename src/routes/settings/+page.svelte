<script lang="ts">
  import { builtInFieldsByModel, fieldModels, fieldVisibilities } from '$lib/fields';

  let { data, form } = $props();

  const labelForModel = (model: 'coffee' | 'shot') => (model === 'coffee' ? 'Coffee fields' : 'Shot fields');
</script>

<div class="page-title">
  <div>
    <h1>Settings</h1>
    <p>Single-user LAN app settings.</p>
  </div>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if form?.saved}<p class="card">Settings saved.</p>{/if}

<form method="POST" action="?/save" class="card form-grid">
  <label>
    Units
    <select name="unitSystem">
      <option value="metric" selected={data.unitSystem === 'metric'}>Metric (g, C)</option>
      <option value="imperial" selected={data.unitSystem === 'imperial'}>Imperial (oz, F)</option>
    </select>
  </label>
  <div class="full">
    <p class="muted">Values are stored internally as grams and Celsius, then displayed in your preferred units.</p>
  </div>
  <div class="full settings-grid">
    {#each fieldModels as model}
      <section>
        <h2>{labelForModel(model)}</h2>
        <div class="field-list">
          {#each builtInFieldsByModel[model] as field}
            <label class="field-row">
              <span>
                {field.label}
                {#if !field.hideable}<small>Required</small>{/if}
              </span>
              <select name={`field:${model}:${field.name}`}>
                {#each fieldVisibilities as visibility}
                  {#if visibility !== 'hidden' || field.hideable}
                    <option value={visibility} selected={data.fieldConfig[model][field.name] === visibility}>{visibility}</option>
                  {/if}
                {/each}
              </select>
            </label>
          {/each}
          {#each data.customFields.filter((field) => field.model === model) as field}
            <label class="field-row">
              <span>{field.label}<small>Custom</small></span>
              <select name={`customField:${field.id}`}>
                {#each fieldVisibilities as visibility}
                  <option value={visibility} selected={field.visibility === visibility}>{visibility}</option>
                {/each}
              </select>
            </label>
          {/each}
        </div>
      </section>
    {/each}
  </div>
  <div class="actions full">
    <button type="submit">Save settings</button>
  </div>
</form>

<section class="card">
  <h2>Add custom field</h2>
  <form method="POST" action="?/addCustomField" class="form-grid compact-form">
    <label>
      Model
      <select name="model">
        <option value="coffee">Coffee</option>
        <option value="shot">Shot</option>
      </select>
    </label>
    <label>Label <input name="label" required placeholder="Basket, puck prep, cafe..." /></label>
    <label>
      Type
      <select name="inputType">
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="date">Date</option>
        <option value="textarea">Long text</option>
      </select>
    </label>
    <label>
      Starts in
      <select name="visibility">
        <option value="main">Main form</option>
        <option value="extras">Extras</option>
        <option value="hidden">Hidden</option>
      </select>
    </label>
    <div class="actions full">
      <button type="submit">Add field</button>
    </div>
  </form>
</section>
