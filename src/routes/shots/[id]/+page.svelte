<script lang="ts">
  import { getFieldVisibility, hasExtras } from '$lib/fields';
  import {
    displayTemperature,
    displayWeight,
    fromStoredTemperature,
    fromStoredWeight,
    temperatureLabel,
    toDateTimeInput,
    weightLabel
  } from '$lib/units';

  let { data, form } = $props();

  const drinkTypes = ['Espresso', 'Americano', 'Latte', 'Cappuccino', 'Flat white', 'Cortado', 'Other'];
  let pulledAt = $state(initialPulledAt());
  let pulledAtMs = $derived(new Date(pulledAt).getTime());

  const fieldIs = (name: string, visibility: 'main' | 'extras') => getFieldVisibility(data.fieldConfig, 'shot', name) === visibility;
  const fieldVisible = (name: string) => getFieldVisibility(data.fieldConfig, 'shot', name) !== 'hidden';
  const customFields = (visibility: 'main' | 'extras') => data.customFields.filter((field) => field.visibility === visibility);
  const customValue = (id: string) => data.customFieldValues[id] ?? '';

  function initialPulledAt() {
    return toDateTimeInput(data.shot.pulledAt);
  }
</script>

<div class="page-title">
  <div>
    <h1>{data.coffee?.brand ?? 'Shot'}</h1>
    <p>{data.coffee?.blend ?? ''} - {data.shot.drinkType}</p>
  </div>
  <a class="button secondary" href={`/coffees/${data.shot.coffeeId}`}>Coffee history</a>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if form?.saved}<p class="card">Shot saved.</p>{/if}

<section class="grid two">
  <form method="POST" action="?/update" class="card form-grid">
    {#if fieldIs('coffeeId', 'main')}
      <label class="full">
        Coffee
        <select name="coffeeId" required>
          {#each data.coffees as coffee}
            <option value={coffee.id} selected={coffee.id === data.shot.coffeeId}>
              {coffee.brand} - {coffee.blend}
            </option>
          {/each}
        </select>
      </label>
    {/if}
    {#if fieldIs('pulledAt', 'main')}
      <label>
        When
        <input name="pulledAtMs" type="hidden" value={Number.isFinite(pulledAtMs) ? pulledAtMs : ''} />
        <input name="pulledAt" type="datetime-local" bind:value={pulledAt} />
      </label>
    {/if}
    {#if fieldIs('drinkType', 'main')}
      <label>
        Drink type
        <select name="drinkType" required>
          {#each drinkTypes as drinkType}
            <option selected={drinkType === data.shot.drinkType}>{drinkType}</option>
          {/each}
        </select>
      </label>
    {/if}
    {#if fieldIs('dose', 'main')}
      <label>
        Dose in ({weightLabel(data.unitSystem)})
        <input name="dose" type="number" step="0.1" value={fromStoredWeight(data.shot.doseGrams, data.unitSystem)} />
      </label>
    {/if}
    {#if fieldIs('yield', 'main')}
      <label>
        Yield out ({weightLabel(data.unitSystem)})
        <input name="yield" type="number" step="0.1" value={fromStoredWeight(data.shot.yieldGrams, data.unitSystem)} />
      </label>
    {/if}
    {#if fieldIs('shotTimeSeconds', 'main')}<label>Shot time (seconds) <input name="shotTimeSeconds" type="number" step="0.1" value={data.shot.shotTimeSeconds ?? ''} /></label>{/if}
    {#if fieldIs('grindSize', 'main')}<label>Grind size <input name="grindSize" value={data.shot.grindSize ?? ''} /></label>{/if}
    {#if fieldIs('grindTimeSeconds', 'main')}<label>Grind time (seconds) <input name="grindTimeSeconds" type="number" step="0.1" value={data.shot.grindTimeSeconds ?? ''} /></label>{/if}
    {#if fieldIs('temperature', 'main')}
      <label>
        Temperature ({temperatureLabel(data.unitSystem)})
        <input name="temperature" type="number" step="1" value={fromStoredTemperature(data.shot.temperatureC, data.unitSystem)} />
      </label>
    {/if}
    {#if fieldIs('rating', 'main')}<label>Rating (1-10) <input name="rating" type="number" min="1" max="10" value={data.shot.rating ?? ''} /></label>{/if}
    {#if fieldIs('tasteNotes', 'main')}<label class="full">Taste notes <textarea name="tasteNotes" value={data.shot.tasteNotes ?? ''}></textarea></label>{/if}
    {#if fieldIs('machineNotes', 'main')}<label class="full">Machine/settings notes <textarea name="machineNotes" value={data.shot.machineNotes ?? ''}></textarea></label>{/if}
    {#if fieldIs('resultNotes', 'main')}<label class="full">Result notes <textarea name="resultNotes" value={data.shot.resultNotes ?? ''}></textarea></label>{/if}
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
    {#if hasExtras(data.fieldConfig, 'shot', data.customFields)}
      <details class="extras full">
        <summary>Extras</summary>
        <div class="form-grid">
          {#if fieldIs('coffeeId', 'extras')}
            <label class="full">
              Coffee
              <select name="coffeeId" required>
                {#each data.coffees as coffee}
                  <option value={coffee.id} selected={coffee.id === data.shot.coffeeId}>
                    {coffee.brand} - {coffee.blend}
                  </option>
                {/each}
              </select>
            </label>
          {/if}
          {#if fieldIs('pulledAt', 'extras')}
            <label>
              When
              <input name="pulledAtMs" type="hidden" value={Number.isFinite(pulledAtMs) ? pulledAtMs : ''} />
              <input name="pulledAt" type="datetime-local" bind:value={pulledAt} />
            </label>
          {/if}
          {#if fieldIs('drinkType', 'extras')}
            <label>
              Drink type
              <select name="drinkType" required>
                {#each drinkTypes as drinkType}
                  <option selected={drinkType === data.shot.drinkType}>{drinkType}</option>
                {/each}
              </select>
            </label>
          {/if}
          {#if fieldIs('dose', 'extras')}
            <label>
              Dose in ({weightLabel(data.unitSystem)})
              <input name="dose" type="number" step="0.1" value={fromStoredWeight(data.shot.doseGrams, data.unitSystem)} />
            </label>
          {/if}
          {#if fieldIs('yield', 'extras')}
            <label>
              Yield out ({weightLabel(data.unitSystem)})
              <input name="yield" type="number" step="0.1" value={fromStoredWeight(data.shot.yieldGrams, data.unitSystem)} />
            </label>
          {/if}
          {#if fieldIs('shotTimeSeconds', 'extras')}<label>Shot time (seconds) <input name="shotTimeSeconds" type="number" step="0.1" value={data.shot.shotTimeSeconds ?? ''} /></label>{/if}
          {#if fieldIs('grindSize', 'extras')}<label>Grind size <input name="grindSize" value={data.shot.grindSize ?? ''} /></label>{/if}
          {#if fieldIs('grindTimeSeconds', 'extras')}<label>Grind time (seconds) <input name="grindTimeSeconds" type="number" step="0.1" value={data.shot.grindTimeSeconds ?? ''} /></label>{/if}
          {#if fieldIs('temperature', 'extras')}
            <label>
              Temperature ({temperatureLabel(data.unitSystem)})
              <input name="temperature" type="number" step="1" value={fromStoredTemperature(data.shot.temperatureC, data.unitSystem)} />
            </label>
          {/if}
          {#if fieldIs('rating', 'extras')}<label>Rating (1-10) <input name="rating" type="number" min="1" max="10" value={data.shot.rating ?? ''} /></label>{/if}
          {#if fieldIs('tasteNotes', 'extras')}<label class="full">Taste notes <textarea name="tasteNotes" value={data.shot.tasteNotes ?? ''}></textarea></label>{/if}
          {#if fieldIs('machineNotes', 'extras')}<label class="full">Machine/settings notes <textarea name="machineNotes" value={data.shot.machineNotes ?? ''}></textarea></label>{/if}
          {#if fieldIs('resultNotes', 'extras')}<label class="full">Result notes <textarea name="resultNotes" value={data.shot.resultNotes ?? ''}></textarea></label>{/if}
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

  <aside class="card">
    <h2>Shot summary</h2>
    {#if fieldVisible('dose')}<p><strong>Dose:</strong> {displayWeight(data.shot.doseGrams, data.unitSystem)}</p>{/if}
    {#if fieldVisible('yield')}<p><strong>Yield:</strong> {displayWeight(data.shot.yieldGrams, data.unitSystem)}</p>{/if}
    {#if fieldVisible('shotTimeSeconds')}<p><strong>Time:</strong> {data.shot.shotTimeSeconds ?? '-'} seconds</p>{/if}
    {#if fieldVisible('temperature')}<p><strong>Temperature:</strong> {displayTemperature(data.shot.temperatureC, data.unitSystem) || '-'}</p>{/if}
    {#if fieldVisible('rating')}<p><strong>Rating:</strong> {data.shot.rating ? `${data.shot.rating}/10` : '-'}</p>{/if}
    {#each data.customFields.filter((field) => field.visibility !== 'hidden') as field}
      <p><strong>{field.label}:</strong> {customValue(field.id) || '-'}</p>
    {/each}
    <form method="POST" action="?/delete">
      <button class="danger" type="submit">Delete shot</button>
    </form>
  </aside>
</section>
