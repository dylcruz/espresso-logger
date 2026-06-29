<script lang="ts">
  import { formatDate } from '$lib/units';

  let { data } = $props();
</script>

<div class="page-title">
  <div>
    <h1>Coffees</h1>
    <p>Manage the beans and blends you pull shots with.</p>
  </div>
  <a class="button" href="/coffees/new">Add coffee</a>
</div>

<section class="table-card">
  {#if data.coffees.length === 0}
    <p class="empty">No coffees yet.</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>Coffee</th>
          <th>Roast</th>
          <th>Origin</th>
          <th>Roast date</th>
        </tr>
      </thead>
      <tbody>
        {#each data.coffees as coffee}
          <tr>
            <td><a href={`/coffees/${coffee.id}`}><strong>{coffee.brand}</strong> {coffee.blend}</a></td>
            <td>{coffee.roastLevel ?? '-'}</td>
            <td>{coffee.origin ?? '-'}</td>
            <td>{coffee.roastDate ? formatDate(coffee.roastDate) : '-'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</section>
