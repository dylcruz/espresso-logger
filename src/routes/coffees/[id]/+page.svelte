<script lang="ts">
  import { displayWeight, formatDateTime } from '$lib/units';

  let { data, form } = $props();
</script>

<div class="page-title">
  <div>
    <h1>{data.coffee.brand}</h1>
    <p>{data.coffee.blend}</p>
  </div>
  <a class="button" href={`/shots/new?coffee=${data.coffee.id}`}>Log shot</a>
</div>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if form?.saved}<p class="card">Coffee saved.</p>{/if}

<section class="grid two">
  <form method="POST" action="?/update" class="card form-grid">
    <label>Brand <input name="brand" required value={data.coffee.brand} /></label>
    <label>Blend/name <input name="blend" required value={data.coffee.blend} /></label>
    <label>Roast level <input name="roastLevel" value={data.coffee.roastLevel ?? ''} /></label>
    <label>Roast date <input name="roastDate" type="date" value={data.coffee.roastDate ?? ''} /></label>
    <label>Origin <input name="origin" value={data.coffee.origin ?? ''} /></label>
    <label>Process <input name="process" value={data.coffee.process ?? ''} /></label>
    <label class="full">Notes <textarea name="notes" value={data.coffee.notes ?? ''}></textarea></label>
    <div class="actions full">
      <button type="submit">Save changes</button>
    </div>
  </form>

  <div class="card">
    <h2>Profile</h2>
    <p><strong>Roast:</strong> {data.coffee.roastLevel ?? '-'}</p>
    <p><strong>Origin:</strong> {data.coffee.origin ?? '-'}</p>
    <p><strong>Process:</strong> {data.coffee.process ?? '-'}</p>
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
