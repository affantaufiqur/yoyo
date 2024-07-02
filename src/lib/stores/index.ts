import { writable } from 'svelte/store';

const fetchResult = writable<Object>({});
const endpoint = writable<string>('');

export { fetchResult, endpoint };
