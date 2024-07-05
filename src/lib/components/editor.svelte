<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { EditorView, basicSetup } from "codemirror";
	import { json } from "@codemirror/lang-json";
	import { EditorView as ThemeEditor } from "@codemirror/view";
	import { EditorState } from "@codemirror/state";
	import { fetchResult } from "$lib/stores";
	import { baseTheme } from "$lib/editor";

	let view: EditorView;
	let bind: HTMLDivElement;

	$: if ($fetchResult) {
		view?.dispatch({
			changes: {
				from: 0,
				to: view.state.doc.length,
				insert: JSON.stringify($fetchResult?.data, null, 2)
			}
		});
	}

	onMount(() => {
		const additionalTheme = ThemeEditor.theme({
			"&": {
				height: "600px !important",
				border: "1px solid rgb(31 41 55) !important"
			},
			".cm-scroller": {
				overflow: "auto !important"
			},
			".cm-line > *": {
				color: "white"
			}
		});

		view = new EditorView({
			parent: bind,
			doc: $fetchResult ? JSON.stringify($fetchResult?.data, null, 2) : "",
			extensions: [basicSetup, baseTheme, additionalTheme, json(), EditorState.readOnly.of(true)]
		});
	});

	onDestroy(() => {
		view?.destroy();
		bind?.remove();
	});
</script>

<div bind:this={bind} class="h-full" />
