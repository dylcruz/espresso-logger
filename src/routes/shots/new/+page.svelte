<script lang="ts">
  import { getFieldVisibility, hasExtras } from '$lib/fields';
  import { temperatureLabel, toDateTimeInput, weightLabel } from '$lib/units';

  let { data, form } = $props();

  let pulledAt = $state(toDateTimeInput(null));
  let pulledAtMs = $derived(new Date(pulledAt).getTime());

  const drinkTypes = ['Espresso', 'Americano', 'Latte', 'Cappuccino', 'Flat white', 'Cortado', 'Other'];
  const fieldIs = (name: string, visibility: 'main' | 'extras') => getFieldVisibility(data.fieldConfig, 'shot', name) === visibility;
  const customFields = (visibility: 'main' | 'extras') => data.customFields.filter((field) => field.visibility === visibility);
</script>

<div class="page-title">
  <div>
    <h1>Log shot</h1>
    <p>Record the recipe, machine settings, and result.</p>
  </div>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}

{#if data.coffees.length === 0}
  <section class="card">
    <h2>No coffees available</h2>
    <p class="muted">Add a coffee or enable one for the Log shot menu.</p>
    <a class="button" href="/coffees/new">Add coffee</a>
  </section>
{:else}
  <form method="POST" class="card form-grid">
    {#if fieldIs('coffeeId', 'main')}
      <label class="full">
        Coffee
        <select name="coffeeId" required>
          {#each data.coffees as coffee}
            <option value={coffee.id} selected={coffee.id === data.selectedCoffeeId}>
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
            <option>{drinkType}</option>
          {/each}
        </select>
      </label>
    {/if}
    {#if fieldIs('dose', 'main')}<label>Dose in ({weightLabel(data.unitSystem)}) <input name="dose" type="number" step="0.1" /></label>{/if}
    {#if fieldIs('yield', 'main')}<label>Yield out ({weightLabel(data.unitSystem)}) <input name="yield" type="number" step="0.1" /></label>{/if}
    {#if fieldIs('shotTimeSeconds', 'main')}<label>Shot time (seconds) <input name="shotTimeSeconds" type="number" step="0.1" /></label>{/if}
    {#if fieldIs('grindSize', 'main')}<label>Grind size <input name="grindSize" placeholder="Barista Touch setting" /></label>{/if}
    {#if fieldIs('grindTimeSeconds', 'main')}<label>Grind time (seconds) <input name="grindTimeSeconds" type="number" step="0.1" /></label>{/if}
    {#if fieldIs('temperature', 'main')}<label>Temperature ({temperatureLabel(data.unitSystem)}) <input name="temperature" type="number" step="1" /></label>{/if}
    {#if fieldIs('rating', 'main')}<label>Rating (1-10) <input name="rating" type="number" min="1" max="10" /></label>{/if}
    {#if fieldIs('tasteNotes', 'main')}<label class="full">Taste notes <textarea name="tasteNotes" placeholder="Sweet, sour, bitter, balanced..."></textarea></label>{/if}
    {#if fieldIs('machineNotes', 'main')}<label class="full">Machine/settings notes <textarea name="machineNotes" placeholder="Pre-infusion, basket, milk settings, puck prep..."></textarea></label>{/if}
    {#if fieldIs('resultNotes', 'main')}<label class="full">Result notes <textarea name="resultNotes" placeholder="What to repeat or change next time?"></textarea></label>{/if}
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
    {#if hasExtras(data.fieldConfig, 'shot', data.customFields)}
      <details class="extras full">
        <summary>Extras</summary>
        <div class="form-grid">
          {#if fieldIs('coffeeId', 'extras')}
            <label class="full">
              Coffee
              <select name="coffeeId" required>
                {#each data.coffees as coffee}
                  <option value={coffee.id} selected={coffee.id === data.selectedCoffeeId}>
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
                  <option>{drinkType}</option>
                {/each}
              </select>
            </label>
          {/if}
          {#if fieldIs('dose', 'extras')}<label>Dose in ({weightLabel(data.unitSystem)}) <input name="dose" type="number" step="0.1" /></label>{/if}
          {#if fieldIs('yield', 'extras')}<label>Yield out ({weightLabel(data.unitSystem)}) <input name="yield" type="number" step="0.1" /></label>{/if}
          {#if fieldIs('shotTimeSeconds', 'extras')}<label>Shot time (seconds) <input name="shotTimeSeconds" type="number" step="0.1" /></label>{/if}
          {#if fieldIs('grindSize', 'extras')}<label>Grind size <input name="grindSize" placeholder="Barista Touch setting" /></label>{/if}
          {#if fieldIs('grindTimeSeconds', 'extras')}<label>Grind time (seconds) <input name="grindTimeSeconds" type="number" step="0.1" /></label>{/if}
          {#if fieldIs('temperature', 'extras')}<label>Temperature ({temperatureLabel(data.unitSystem)}) <input name="temperature" type="number" step="1" /></label>{/if}
          {#if fieldIs('rating', 'extras')}<label>Rating (1-10) <input name="rating" type="number" min="1" max="10" /></label>{/if}
          {#if fieldIs('tasteNotes', 'extras')}<label class="full">Taste notes <textarea name="tasteNotes" placeholder="Sweet, sour, bitter, balanced..."></textarea></label>{/if}
          {#if fieldIs('machineNotes', 'extras')}<label class="full">Machine/settings notes <textarea name="machineNotes" placeholder="Pre-infusion, basket, milk settings, puck prep..."></textarea></label>{/if}
          {#if fieldIs('resultNotes', 'extras')}<label class="full">Result notes <textarea name="resultNotes" placeholder="What to repeat or change next time?"></textarea></label>{/if}
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
      <button type="submit">Save shot</button>
      <a class="button secondary" href="/">Cancel</a>
    </div>
  </form>
{/if}
