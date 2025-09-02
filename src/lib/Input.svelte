<script lang="ts">
  export let value: string;
  export let placeholder = '';
</script>

<input bind:value placeholder={placeholder} class="input" />
