<script lang="ts">
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { ChevronDown, Loader, Send } from 'lucide-svelte';
	import { type PostBodyType } from '$lib/types';
	import { httpStatusCodes } from '$lib/config/statusMessage';
	import {
		fetchResult,
		endpoint,
		keyDownEvent,
		fetchStatus,
		editor,
		reqLoading
	} from '$lib/stores';
	import { onMount } from 'svelte';
	import { editorView } from '$lib/editor';

	const {
		elements: { menu, item, trigger },
		states: { open }
	} = createDropdownMenu();

	let editorBind: HTMLDivElement;

	let method: string = 'GET';
	let methodArray: string[] = ['GET', 'POST', 'PUT', 'DELETE'];
	let url: string;
	let result: any;

	$: if ($keyDownEvent) {
		handleKeyDown($keyDownEvent);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.ctrlKey && (e.key === 'L' || e.key === 'l')) {
			e.preventDefault();
			$editor?.focus();
		}
	}

	const send = async () => {
		try {
			$reqLoading = true;
			const req = await fetch('/api', {
				method: 'POST',
				body: JSON.stringify({
					url,
					options: {}
				} as PostBodyType)
			});

			result = await req.json();

			$fetchStatus = httpStatusCodes[result.status.toString() as keyof typeof httpStatusCodes];

			$fetchResult = result;
			$endpoint = url;
		} catch (e) {
			console.log(e);
		} finally {
			$reqLoading = false;
		}
	};

	onMount(() => {
		$editor = editorView(editorBind);
	});
</script>

<div
	class="flex h-fit w-full max-w-full items-start overflow-x-hidden text-wrap rounded-sm border-[1px] border-gray-800 bg-gray-900"
>
	<button
		use:melt={$trigger}
		class="flex min-w-[6rem] items-center justify-between space-x-1 rounded-l-sm bg-gray-900 px-3 py-1 text-sm text-gray-400 transition-all duration-100 hover:bg-gray-700"
	>
		<span>{method}</span>
		<ChevronDown
			class="h-4 w-4 {$open ? 'rotate-180' : ''} items-end transition-all duration-200"
		/>
	</button>
	<div
		use:melt={$menu}
		class="!left-[15px] min-w-[6rem] flex-col rounded border-[1px] border-gray-800 bg-gray-900 py-2 text-gray-200"
	>
		{#each methodArray as m}
			<div
				use:melt={$item}
				class="cursor-pointer px-4 py-1 text-sm hover:bg-gray-800"
				on:m-click={() => (method = m)}
			>
				{m}
			</div>
		{/each}
	</div>
	<div
		role="textbox"
		tabindex="0"
		aria-roledescription="editor"
		class="parent no-scrollbar h-full w-full overflow-x-hidden focus:outline-red-300"
		bind:this={editorBind}
		on:keydown={(e) => {
			if (e.key === 'Enter' && e.shiftKey === true) {
				url = $editor?.state?.doc?.toString();
			}
		}}
	/>
	<button
		class="rounded-r-sm px-3 py-1 text-sm transition-all duration-100 hover:bg-gray-700"
		disabled={$reqLoading}
		on:click={() => {
			url = $editor?.state?.doc?.toString();
			if (!url) return;
			send();
		}}
	>
		{#if $reqLoading}
			<div class="h-full w-full p-1">
				<Loader class="h-3 w-3 animate-spin text-white" />
			</div>
		{:else}
			<div class="inline-flex items-center justify-center">
				<span class="text-sm text-white"><Send class="h-3 w-3" /></span>
			</div>
		{/if}
	</button>
</div>
