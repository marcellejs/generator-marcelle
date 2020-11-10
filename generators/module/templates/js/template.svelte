<script>
  import { ModuleBase } from '<% if (!isMarcelleCore) { %>@marcellejs/core<% } else { %>../../core<% } %>';

  export let title;
  export let options;
</script>

<style>
  .my-color {
    color: seagreen;
  }
</style>

<svelte:options accessors />

<ModuleBase {title}>
  <div>This is a <span class="my-color">custom</span> module with the following options:</div>
  <p>{JSON.stringify(options)}</p>
</ModuleBase>
