<script>
  import { ModuleBase } from '@marcellejs/core';

  export let title;
  export let count;
</script>

<style>
  .my-color {
    color: seagreen;
  }
</style>

<svelte:options accessors />

<ModuleBase {title}>
  <div>
    This dataset contains
    <span class="my-color">{$count}</span>
    instance{$count > 1 ? 's' : ''}
  </div>
</ModuleBase>
