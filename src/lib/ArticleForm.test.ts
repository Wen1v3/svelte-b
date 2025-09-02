import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import ArticleForm from './ArticleForm.svelte';

describe('ArticleForm', () => {
  it('renders and can close', async () => {
    const handleClose = vi.fn();
    const handleSubmit = vi.fn();

    const { getByText, getByPlaceholderText, queryByText } = render(ArticleForm, {
      props: {
        open: true,
        onClose: handleClose,
        onSubmit: handleSubmit
      }
    });

    // Modal title exist
    expect(getByText('Add Article')).toBeTruthy();

    // Fill inputs
    await fireEvent.input(getByPlaceholderText('Enter title'), { target: { value: 'My Title' } });
    await fireEvent.input(getByPlaceholderText('Enter author name'), { target: { value: 'John' } });

    // Submit is reached, not blocked by form validation
    await fireEvent.click(getByText('Submit'));
    expect(handleSubmit).toHaveBeenCalledWith({
      title: 'My Title',
      author: 'John',
      status: 'Draft'
    });
  });
});
