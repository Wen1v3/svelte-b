<style>
  .light-theme {
    color: #85e2ff;
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte';
  import Input from '$lib/Input.svelte';
  import Button from '$lib/Button.svelte';
  import { themeStore } from '../stores/theme';
  import ArticleForm from '$lib/ArticleForm.svelte';
  import { formatDate } from '../utils/format';

  type Article = {
    id: string;
    title: string;
    status: string;
    author: string;
    createdAt: string;
  };

  let articles: Article[] = [];
  let totalPageNum = 0;
  let page = 1;
  let pageSize = 10;
  let search = '';
  let statusFilter = '';
  let loading = false;

  // Add/Edit modal logic
  let modalOpen = false;
  let editing: Partial<Article> = {};

  $: visibleArticles = statusFilter ? articles.filter(a => a.status === statusFilter) : articles;

  const fetchArticles = async () => {
    loading = true;

    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) q.set('search', search);

    const res = await fetch(`/api/articles?${q.toString()}`);
    const data = await res.json();

    articles = data.articles;
    totalPageNum = data.totalPageNum;
    loading = false;

    console.log(data);
  };

  onMount(fetchArticles);

  async function remove(id: string) {
    if (confirm('Confirm delete?')) {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      fetchArticles();
    }
  }

  function openModal(article?: Article) {
    if (article) {
      editing = { ...article };
    } else {
      editing = {};
    }
    modalOpen = true;
  }

  async function handleFormSubmit(payload) {
    const newArticle = { ...payload, createdAt: new Date().toISOString() };
    if (editing.id) {
      await fetch(`/api/articles/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
      });
    } else {
      await fetch(`/api/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
      });
    }
    modalOpen = false;
    fetchArticles();
  }
</script>

<div class={$themeStore === 'dark' ? 'dark-theme' : 'light-theme'}>
  <button on:click={() => themeStore.toggle()}>Toggle Theme</button>
  <p>Current theme: {$themeStore}</p>

  <Input bind:value={search} placeholder="Search by title" />
  <Button label="Search" onClick={() => {page = 1; fetchArticles()}} />

  <select bind:value={statusFilter}>
    <option value="">All Status</option>
    <option value="Published">Published</option>
    <option value="Draft">Draft</option>
  </select>
  <Button label="Add Article" onClick={() => {openModal()}} />

  {#if loading}
  <p>Loading...</p>
  {:else if visibleArticles.length}
  <table>
    <thead>
      <tr>
        <th>Title</th><th>Status</th><th>Author</th><th>Created At</th><th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each visibleArticles as art}
        <tr>
          <td>{art.title}</td>
          <td>{art.status}</td>
          <td>{art.author}</td>
          <td>{new Date(art.createdAt).toLocaleString()}----{formatDate(art.createdAt)}</td>
          <td>
            <Button label="Edit" onClick={() => openModal(art)} />
            <Button label="Delete" onClick={() => remove(art.id)} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <div>
    <Button label="Prev" disabled={page === 1} onClick={() => { page--; fetchArticles(); }} />
    <span>Page {page} / {totalPageNum}</span>
    <Button label="Next" disabled={page === totalPageNum} onClick={() => { page++; fetchArticles(); }} />
  </div>
  {/if}

  <ArticleForm
    open={modalOpen}
    article={editing}
    onSubmit={handleFormSubmit}
    onClose={() => (modalOpen = false)}
  />
</div>

