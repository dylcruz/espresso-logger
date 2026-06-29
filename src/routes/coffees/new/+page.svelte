<script lang="ts">
  let { form } = $props();
</script>

<div class="page-title">
  <div>
    <h1>Add coffee</h1>
    <p>Record a brand and blend before logging shots.</p>
  </div>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}

<form method="POST" class="card form-grid">
  <label>Brand <input name="brand" required /></label>
  <label>Blend/name <input name="blend" required /></label>
  <label>Roast level <input name="roastLevel" placeholder="Medium" /></label>
  <label>Roast date <input name="roastDate" type="date" /></label>
  <label>Origin <input name="origin" placeholder="Colombia, Ethiopia..." /></label>
  <label>Process <input name="process" placeholder="Washed, natural, honey..." /></label>
  <label class="full">Notes <textarea name="notes"></textarea></label>
  <div class="actions full">
    <button type="submit">Save coffee</button>
    <a class="button secondary" href="/coffees">Cancel</a>
  </div>
</form>
