<script lang="ts">
	import type { EditorView } from 'codemirror';
	import { editorView } from '$lib/editor';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { ChevronDown, Loader, Send } from 'lucide-svelte';
	import Editor from '$lib/components/editor.svelte';
	import { httpStatusCodes } from '$lib/config/statusMessage';
	import { onDestroy, onMount } from 'svelte';
	import { fetchResult, endpoint } from '$lib/stores';

	type PostBodyType = {
		url: string;
		options: RequestInit;
		body: any;
	};

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
	let expand: boolean = false;

	let result: any;

	const send = async () => {
		try {
			reqLoading = true;
			const req = await fetch('/api', {
				method: 'POST',
				body: JSON.stringify({
					url,
					options: {}
				} as PostBodyType)
			});

			result = await req.json();

			responseMessage = httpStatusCodes[result.status.toString() as keyof typeof httpStatusCodes];

			fetchResult.set(result);
			endpoint.set(url);
		} catch (e) {
			console.log(e);
		} finally {
			reqLoading = false;
		}
	};

	function handleKeyDown(e: KeyboardEvent) {
		if (e.ctrlKey && (e.key === 'L' || e.key === 'l')) {
			e.preventDefault();
			view?.focus();
			expand = !expand;
		}
	}

	onMount(() => {
		view = editorView(editorBind);
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKeyDown);
		}
	});

	onDestroy(() => {
		view?.destroy();
		editorBind?.remove();

		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeyDown);
		}
	});
</script>

<div class="p-4">
	<div class="flex w-full justify-between space-x-2">
		<div
			class="flex h-fit w-full max-w-full items-start overflow-x-hidden text-wrap rounded-sm border-[1px] border-gray-600 bg-[#1F2937]"
		>
			<button
				use:melt={$trigger}
				class="flex min-w-[6rem] items-center justify-between space-x-1 rounded-l-sm bg-[#1F2937] px-3 py-1 text-sm text-gray-400 transition-all duration-100 hover:bg-gray-700"
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
				class="parent no-scrollbar h-full w-full overflow-x-hidden focus:outline-red-300"
				bind:this={editorBind}
				on:keydown={(e) => {
					if (e.key === 'Enter' && e.shiftKey === true) {
						url = view?.state?.doc?.toString();
					}
				}}
			/>
			<button
				class="rounded-r-sm px-3 py-1 text-sm transition-all duration-100 hover:bg-gray-700"
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
					<div class="inline-flex items-center justify-center">
						<span class="text-sm text-white"><Send class="h-3 w-3" /></span>
					</div>
				{/if}
			</button>
		</div>

		<div class="flex w-full flex-col space-y-1">
			{#if result}
				<div class="flex space-x-1">
					<p
						class="inline-flex w-fit justify-center p-1.5 text-sm text-white"
						class:bg-blue-900={result.status >= 200 && result.status < 400}
						class:bg-red-600={result.status >= 400 && result.status < 600}
					>
						{result ? `${result.status} (${responseMessage})` : ''}
					</p>
					<span class="text-sm text-white">Headers {Object.keys(result.headers).length}</span>
				</div>
				<div class="flex flex-col space-y-1">
					<!-- {#each Object.entries(result.headers) as [key, value]} -->
					<!-- 	<div class="grid grid-cols-12"> -->
					<!-- 		<p class="col-span-2 inline-flex w-fit p-1.5 text-sm text-white">{key}</p> -->
					<!-- 		<p class="col-span-10 inline-flex w-fit p-1.5 text-sm text-white">{value}</p> -->
					<!-- 	</div> -->
					<!-- {/each} -->
				</div>
			{/if}
			<div class="relative">
				{#if result}
					<Editor data={JSON.stringify(result?.data, null, 2)} />
				{:else}
					<div
						class="flex h-[600px] w-full items-center justify-center rounded-sm border-[1px] border-gray-700 bg-gray-800"
					>
						{#if !reqLoading}
							<div class="flex flex-col items-center space-y-2">
								<p class="text-white">CTRL + L (Focus URL)</p>
							</div>
						{/if}
					</div>
				{/if}
				{#if reqLoading || !result}
					<div class="absolute inset-0 h-full w-full bg-black/30">
						{#if reqLoading}
							<div class="flex h-full items-center justify-center">
								<div class="flex flex-col items-center space-y-2">
									<Loader class="h-12 w-12 animate-spin text-white" />
									<button class="result-sm bg-white px-1.5 py-0.5 text-black">Cancel</button>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	/* For Webkit browsers (Chrome, Safari, newer versions of Opera) */
	::-webkit-scrollbar {
		width: 10px;
	}

	::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 10px;
	}

	::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 10px;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}

	/* For Firefox */
	* {
		scrollbar-width: thin;
		scrollbar-color: #888 #f1f1f1;
	}
</style>
