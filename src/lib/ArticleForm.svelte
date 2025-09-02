<script lang="ts">
  import Modal from '$lib/Modal.svelte';
  import Input from '$lib/Input.svelte';
  import Button from '$lib/Button.svelte';

  export let open = false;
  export let article: { id?: string; title?: string; status?: string; author?: string } = {};
  export let onSubmit: (payload: { title: string; status: string; author: string }) => void;
  export let onClose: () => void;

  let title = article.title || '';
  let status = article.status || 'Draft';
  let author = article.author || '';

  $: if (article) {
    title = article.title || '';
    status = article.status || 'Draft';
    author = article.author || '';
  }

  function submit() {
    if (!title.trim() || !author.trim()) {
      console.log('Title and Author are required.');
      return;
    }
    onSubmit({ title, status, author });
  }
</script>

<Modal {open} on:close={onClose}>
  <h2>{article?.id ? 'Edit Article' : 'Add Article'}</h2>
  <div>
    <label>
      Title:
      <Input bind:value={title} placeholder="Enter title" />
    </label>
  </div>
  <div>
    <label>
      Status:
      <select bind:value={status}>
        <option value="Draft">Draft</option>
        <option value="Published">Published</option>
      </select>
    </label>
  </div>
  <div>
    <label>
      Author:
      <Input bind:value={author} placeholder="Enter author name" />
    </label>
  </div>
  <div>
    <Button label="Submit" type="submit" onClick={submit} />
    <Button label="Cancel" onClick={onClose} />
  </div>
</Modal>
