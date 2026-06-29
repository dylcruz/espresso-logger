<script lang="ts">
  import { displayWeight, formatDateTime } from '$lib/units';

  let { data } = $props();
</script>

<section class="hero">
  <div>
    <h1>Your espresso notebook.</h1>
    <p>Track beans, Breville settings, drink recipes, and tasting notes for every shot.</p>
  </div>
  <div class="actions">
    <a class="button" href="/shots/new">Log a shot</a>
    <a class="button secondary" href="/coffees/new">Add coffee</a>
  </div>
</section>

<section class="grid three">
  <article class="card stat">
    <span class="muted">Coffees</span>
    <strong>{data.coffeeCount}</strong>
  </article>
  <article class="card stat">
    <span class="muted">Shots logged</span>
    <strong>{data.shotCount}</strong>
  </article>
  <article class="card stat">
    <span class="muted">Best rating</span>
    <strong>{data.bestShot ?? '-'}</strong>
  </article>
</section>

<div class="section-title">
  <h2>Recent shots</h2>
  <a class="button secondary" href="/shots/new">New shot</a>
</div>

<section class="table-card">
  {#if data.recentShots.length === 0}
    <p class="empty">No shots yet. Add a coffee, then log your first espresso.</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>When</th>
          <th>Coffee</th>
          <th>Drink</th>
          <th>Recipe</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        {#each data.recentShots as shot}
          <tr>
            <td><a href={`/shots/${shot.id}`}>{formatDateTime(shot.pulledAt)}</a></td>
            <td>{shot.coffeeBrand} {shot.coffeeBlend}</td>
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
