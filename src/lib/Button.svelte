<script lang="ts">
  export let onClick: () => void;
  export let label: string;
  export let type: 'button' | 'submit' = 'button';
  export let disabled: true | false = false;
  disabled
</script>

<button type={type} disabled={disabled} on:click={onClick} class="btn">
  {label}
</button>
