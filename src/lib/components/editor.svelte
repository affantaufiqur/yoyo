<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { EditorView, basicSetup } from 'codemirror';
	import { json } from '@codemirror/lang-json';
	import { EditorView as ThemeEditor } from '@codemirror/view';
	import { EditorState } from '@codemirror/state';

	export let data;

	let view: EditorView;
	let bind: HTMLDivElement;

	$: if (data) {
		view?.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: data } });
	}

	onMount(() => {
		const editorTheme = ThemeEditor.theme(
			{
				'&': {
					color: 'white',
					backgroundColor: 'rgb(31 41 55)',
					'border-radius': '2px',
					border: '1px solid #6b7280',
					height: '600px'
				},
				'&.cm-focused .cm-cursor': {
					borderLeftColor: '#FF5964'
				},
				'.cm-content': {
					caretColor: '#FF5964',
					maxWidth: '200px'
				},
				'.cm-scroller': {
					overflow: 'auto'
				}
			},
			{ dark: true }
		);
		view = new EditorView({
			parent: bind,
			doc: data ? data : '',
			extensions: [basicSetup, editorTheme, json(), EditorState.readOnly.of(true)]
		});
	});

	onDestroy(() => {
		view?.destroy();
		bind?.remove();
	});
</script>

<div bind:this={bind} class="h-full" />
