<script lang="ts">
  import { fieldIsVisible } from '$lib/fields';
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
          {#if fieldIsVisible(data.fieldConfig, 'coffee', 'showOnLog')}<th>Log menu</th>{/if}
          {#if fieldIsVisible(data.fieldConfig, 'coffee', 'roastLevel')}<th>Roast</th>{/if}
          {#if fieldIsVisible(data.fieldConfig, 'coffee', 'origin')}<th>Origin</th>{/if}
          {#if fieldIsVisible(data.fieldConfig, 'coffee', 'roastDate')}<th>Roast date</th>{/if}
        </tr>
      </thead>
      <tbody>
        {#each data.coffees as coffee}
          <tr>
            <td><a href={`/coffees/${coffee.id}`}><strong>{coffee.brand}</strong> {coffee.blend}</a></td>
            {#if fieldIsVisible(data.fieldConfig, 'coffee', 'showOnLog')}<td>{coffee.showOnLog ? 'Shown' : 'Hidden'}</td>{/if}
            {#if fieldIsVisible(data.fieldConfig, 'coffee', 'roastLevel')}<td>{coffee.roastLevel ?? '-'}</td>{/if}
            {#if fieldIsVisible(data.fieldConfig, 'coffee', 'origin')}<td>{coffee.origin ?? '-'}</td>{/if}
            {#if fieldIsVisible(data.fieldConfig, 'coffee', 'roastDate')}<td>{coffee.roastDate ? formatDate(coffee.roastDate) : '-'}</td>{/if}
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</section>
