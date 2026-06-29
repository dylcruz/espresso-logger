<script lang="ts">
  import '../app.css';

  let { children, data } = $props();
</script>

<div class="page-shell">
  <header class="topbar">
    <a class="brand" href="/">
      <strong>Espresso Logger</strong>
      <span>Breville Barista Touch logbook</span>
    </a>
    <nav class="nav" aria-label="Primary navigation">
      <a href="/">Dashboard</a>
      <a href="/shots/new">Log Shot</a>
      <a href="/coffees">Coffees</a>
      <a href="/settings">Settings: {data.unitSystem}</a>
    </nav>
  </header>

  {@render children()}
</div>
