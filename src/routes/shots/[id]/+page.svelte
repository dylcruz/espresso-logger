<script lang="ts">
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
    <label>When <input name="pulledAt" type="datetime-local" value={toDateTimeInput(data.shot.pulledAt)} /></label>
    <label>
      Drink type
      <select name="drinkType" required>
        {#each drinkTypes as drinkType}
          <option selected={drinkType === data.shot.drinkType}>{drinkType}</option>
        {/each}
      </select>
    </label>
    <label>
      Dose in ({weightLabel(data.unitSystem)})
      <input name="dose" type="number" step="0.1" value={fromStoredWeight(data.shot.doseGrams, data.unitSystem)} />
    </label>
    <label>
      Yield out ({weightLabel(data.unitSystem)})
      <input name="yield" type="number" step="0.1" value={fromStoredWeight(data.shot.yieldGrams, data.unitSystem)} />
    </label>
    <label>Shot time (seconds) <input name="shotTimeSeconds" type="number" step="0.1" value={data.shot.shotTimeSeconds ?? ''} /></label>
    <label>Grind size <input name="grindSize" value={data.shot.grindSize ?? ''} /></label>
    <label>Grind time (seconds) <input name="grindTimeSeconds" type="number" step="0.1" value={data.shot.grindTimeSeconds ?? ''} /></label>
    <label>
      Temperature ({temperatureLabel(data.unitSystem)})
      <input name="temperature" type="number" step="1" value={fromStoredTemperature(data.shot.temperatureC, data.unitSystem)} />
    </label>
    <label>Rating (1-10) <input name="rating" type="number" min="1" max="10" value={data.shot.rating ?? ''} /></label>
    <label class="full">Taste notes <textarea name="tasteNotes" value={data.shot.tasteNotes ?? ''}></textarea></label>
    <label class="full">Machine/settings notes <textarea name="machineNotes" value={data.shot.machineNotes ?? ''}></textarea></label>
    <label class="full">Result notes <textarea name="resultNotes" value={data.shot.resultNotes ?? ''}></textarea></label>
    <div class="actions full">
      <button type="submit">Save changes</button>
    </div>
  </form>

  <aside class="card">
    <h2>Shot summary</h2>
    <p><strong>Dose:</strong> {displayWeight(data.shot.doseGrams, data.unitSystem)}</p>
    <p><strong>Yield:</strong> {displayWeight(data.shot.yieldGrams, data.unitSystem)}</p>
    <p><strong>Time:</strong> {data.shot.shotTimeSeconds ?? '-'} seconds</p>
    <p><strong>Temperature:</strong> {displayTemperature(data.shot.temperatureC, data.unitSystem) || '-'}</p>
    <p><strong>Rating:</strong> {data.shot.rating ? `${data.shot.rating}/10` : '-'}</p>
    <form method="POST" action="?/delete">
      <button class="danger" type="submit">Delete shot</button>
    </form>
  </aside>
</section>
