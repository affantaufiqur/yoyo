import { writable } from 'svelte/store';

const fetchResult = writable<Object>({});
const endpoint = writable<string>('');
const vimMode = writable<boolean>(false);
const keyDownEvent = writable<KeyboardEvent>();

export { fetchResult, endpoint, vimMode, keyDownEvent };
