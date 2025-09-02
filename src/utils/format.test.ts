import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { formatDate } from './format.ts';

test('Multiplier', () => {
	let date = formatDate("9/2/2025, 10:29:40 PM");
	expect(date).toEqual("Sep 2, 2025, 10:29 PM");
});