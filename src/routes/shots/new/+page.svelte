<script lang="ts">
  import { temperatureLabel, toDateTimeInput, weightLabel } from '$lib/units';

  let { data, form } = $props();
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
    <h2>Add a coffee first</h2>
    <p class="muted">Shots need to be tied to a brand and blend.</p>
    <a class="button" href="/coffees/new">Add coffee</a>
  </section>
{:else}
  <form method="POST" class="card form-grid">
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
    <label>When <input name="pulledAt" type="datetime-local" value={toDateTimeInput(null)} /></label>
    <label>
      Drink type
      <select name="drinkType" required>
        <option>Espresso</option>
        <option>Americano</option>
        <option>Latte</option>
        <option>Cappuccino</option>
        <option>Flat white</option>
        <option>Cortado</option>
        <option>Other</option>
      </select>
    </label>
    <label>Dose in ({weightLabel(data.unitSystem)}) <input name="dose" type="number" step="0.1" /></label>
    <label>Yield out ({weightLabel(data.unitSystem)}) <input name="yield" type="number" step="0.1" /></label>
    <label>Shot time (seconds) <input name="shotTimeSeconds" type="number" step="0.1" /></label>
    <label>Grind size <input name="grindSize" placeholder="Barista Touch setting" /></label>
    <label>Grind time (seconds) <input name="grindTimeSeconds" type="number" step="0.1" /></label>
    <label>Temperature ({temperatureLabel(data.unitSystem)}) <input name="temperature" type="number" step="1" /></label>
    <label>Rating (1-10) <input name="rating" type="number" min="1" max="10" /></label>
    <label class="full">Taste notes <textarea name="tasteNotes" placeholder="Sweet, sour, bitter, balanced..."></textarea></label>
    <label class="full">Machine/settings notes <textarea name="machineNotes" placeholder="Pre-infusion, basket, milk settings, puck prep..."></textarea></label>
    <label class="full">Result notes <textarea name="resultNotes" placeholder="What to repeat or change next time?"></textarea></label>
    <div class="actions full">
      <button type="submit">Save shot</button>
      <a class="button secondary" href="/">Cancel</a>
    </div>
  </form>
{/if}
