import { EditorView } from "codemirror";
import { writable } from "svelte/store";
import type { FetchResult } from "$lib/types";

const fetchResult = writable<FetchResult | null>(null);
const endpoint = writable<string>("");
const vimMode = writable<boolean>(false);
const keyDownEvent = writable<KeyboardEvent | null>();
const fetchStatus = writable<string>("");
const editor = writable<EditorView>();
const reqLoading = writable<boolean>(false);

export { fetchResult, endpoint, vimMode, keyDownEvent, fetchStatus, editor, reqLoading };
