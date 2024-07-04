<script lang="ts">
	import { vimCompartment } from '$lib/editor';
	import { createSwitch, melt } from '@melt-ui/svelte';
	import { vimMode } from '$lib/stores';
	import type { EditorView } from 'codemirror';
	import { vim } from '@replit/codemirror-vim';
	import { writable } from 'svelte/store';

	export let view: EditorView;

	let stateSwitch = writable<boolean>($vimMode);

	const {
		elements: { root, input }
	} = createSwitch({
		checked: stateSwitch,
		onCheckedChange: ({ curr, next }) => {
			if (!curr) {
				return next;
			} else {
				return next;
			}
		}
	});

	function handleVimMode() {
		$vimMode = !$vimMode;
		$stateSwitch = !$vimMode;
		view.dispatch({
			effects: vimCompartment.reconfigure([$vimMode ? vim() : []])
		});
		return vimMode;
	}
</script>

<div class="flex justify-end border-b-[1px] border-gray-300">
	<div class="p-2">
		<div class="flex items-center space-x-2">
			<label for="airplane-mode" class="text-sm text-white">Vim Mode</label>
			<button
				use:melt={$root}
				class="relative h-4 cursor-default rounded-full bg-gray-200/20 transition-colors data-[state=checked]:bg-red-900"
				id="airplane-mode"
				aria-labelledby="airplane-mode-label"
				on:m-click={handleVimMode}
			>
				<span class="thumb block rounded-full bg-white transition" />
			</button>
			<input use:melt={$input} />
		</div>
	</div>
</div>

<style>
	button {
		--w: 2rem;
		--padding: 0.25rem;
		width: var(--w);
	}

	.thumb {
		--size: 0.65rem;
		width: var(--size);
		height: var(--size);
		transform: translateX(var(--padding));
	}

	:global([data-state='checked']) .thumb {
		transform: translateX(calc(var(--w) - var(--size) - var(--padding)));
	}
</style>
