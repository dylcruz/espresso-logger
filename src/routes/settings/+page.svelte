<script lang="ts">
  let { data, form } = $props();
</script>

<div class="page-title">
  <div>
    <h1>Settings</h1>
    <p>Single-user LAN app settings.</p>
  </div>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if form?.saved}<p class="card">Settings saved.</p>{/if}

<form method="POST" class="card form-grid">
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
  <div class="actions full">
    <button type="submit">Save settings</button>
  </div>
</form>

<section class="card">
  <h2>Future iteration notes</h2>
  <p class="muted">Photo uploads are intentionally skipped for the MVP. The schema and Docker volume layout leave room to add coffee bag, puck prep, crema, and latte art photos later.</p>
</section>
