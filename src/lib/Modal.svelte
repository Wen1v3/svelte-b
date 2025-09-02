<style>
  .modal-backdrop {
    position: fixed;
    top: 0; 
    left: 0;
    right: 0; 
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .modal-content {
    background: white;
    padding: 2em;
    border-radius: 8px;
    min-width: 300px;
    max-width: 500px;
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let open = false;
  const dispatch = createEventDispatcher();
  function close() { dispatch('close'); }
</script>

{#if open}
  <div class="modal-backdrop" tabindex="0" on:keydown={(e) => e.key === 'Escape' && close()}>
    <div class="modal-content" role="dialog" aria-modal="true">
      <button on:click={close} aria-label="Close modal">×</button>
      <slot/>
    </div>
  </div>
{/if}
