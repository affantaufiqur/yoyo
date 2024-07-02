<script lang="ts">
	import type { EditorView } from 'codemirror';
	import { editorView } from '$lib/editor';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { ChevronDown, Loader } from 'lucide-svelte';
	import Editor from '$lib/components/editor.svelte';
	import { httpStatusCodes } from '$lib/config/statusMessage';
	import { onDestroy, onMount } from 'svelte';
	import { fetchResult, endpoint } from '$lib/stores';

	const {
		elements: { menu, item, trigger },
		states: { open }
	} = createDropdownMenu();

	let view: EditorView;
	let editorBind: HTMLDivElement;
	let url: string;
	let reqLoading: boolean = false;
	let method: string = 'GET';
	let methodArray: string[] = ['GET', 'POST', 'PUT', 'DELETE'];
	let responseMessage: string;

	let response: Response;
	let result: any;

	const send = async () => {
		reqLoading = true;
		const req = await fetch(url);
		response = req;
		result = await req.json();

		responseMessage = httpStatusCodes[response.status.toString() as keyof typeof httpStatusCodes];

		fetchResult.set(result);
		endpoint.set(url);
		reqLoading = false;
	};

	onMount(() => {
		view = editorView(editorBind);
	});

	onDestroy(() => {
		view?.destroy();
		editorBind?.remove();
	});
</script>

<div class="p-4">
	<div class="flex items-center space-x-1">
		<button
			use:melt={$trigger}
			class="flex min-w-[6rem] items-center justify-between space-x-1 rounded-sm border-[1px] border-gray-600 bg-gray-800 px-3 py-1 text-sm text-gray-400 transition-all duration-100 hover:bg-gray-700"
		>
			<span>{method}</span>
			<ChevronDown
				class="h-4 w-4 {$open ? 'rotate-180' : ''} items-end transition-all duration-200"
			/>
		</button>
		<div
			use:melt={$menu}
			class="!left-[15px] min-w-[6rem] flex-col rounded border-[1px] border-gray-600 bg-gray-800 py-2 text-gray-200"
		>
			{#each methodArray as m}
				<div
					use:melt={$item}
					class="cursor-pointer px-4 py-1 text-sm hover:bg-gray-700"
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
			class="parent w-full"
			bind:this={editorBind}
			on:keydown={(e) => {
				if (e.key === 'Enter' && e.shiftKey === true) {
					url = view?.state?.doc?.toString();
				}
			}}
		/>
		<button
			class="rounded-sm bg-orange-800/70 px-6 py-1 text-sm text-orange-200"
			disabled={reqLoading}
			on:click={() => {
				url = view?.state?.doc?.toString();
				if (!url) return;
				send();
			}}
		>
			{#if reqLoading}
				<div class="h-full w-full p-1">
					<Loader class="h-3 w-3 animate-spin" />
				</div>
			{:else}
				<span class="text-sm">Send</span>
			{/if}
		</button>
	</div>

	<div class="mt-4 flex flex-col space-y-1">
		{#if result}
			<p
				class="inline-flex w-fit justify-center p-1.5 text-sm text-white"
				class:bg-blue-900={response.status >= 200 && response.status < 400}
				class:bg-red-600={response.status >= 400 && response.status < 600}
			>
				{response ? `${response.status} (${responseMessage})` : ''}
			</p>
		{/if}
		<div class="relative">
			<Editor data={JSON.stringify(result, null, 2)} />
			{#if reqLoading || !result}
				<div class="absolute inset-0 h-full w-full bg-black/50" />
			{/if}
		</div>
	</div>
</div>
