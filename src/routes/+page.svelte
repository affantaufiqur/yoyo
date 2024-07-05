<script lang="ts">
	import { Loader } from 'lucide-svelte';
	import Header from '$lib/components/header.svelte';
	import { fetchStatus, reqLoading, fetchResult, keyDownEvent } from '$lib/stores';
	import { onMount, onDestroy } from 'svelte';

	let activeTab = 'Editor';

	onMount(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', (e) => {
				keyDownEvent.set(e);
			});
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', () => {
				keyDownEvent.set(null);
			});
		}
	});
</script>

<Header />
<div class="p-4">
	<div class="flex w-full justify-between space-x-2">
		{#await import('$lib/components/urlBar.svelte') then module}
			<svelte:component this={module.default} />
		{/await}
		<div
			class="flex w-full flex-col space-y-1 overflow-y-hidden rounded-sm border-[1px] border-gray-800 bg-gray-900 p-1 shadow"
		>
			{#if $fetchResult}
				<div class="flex flex-col space-y-4">
					<p
						class="inline-flex w-fit justify-center rounded-sm p-0.5 text-sm font-semibold"
						class:text-green-400={$fetchResult.status >= 200 && $fetchResult.status < 400}
						class:text-red-600={$fetchResult.status >= 400 && $fetchResult.status < 600}
					>
						{$fetchResult ? `${$fetchResult.status} (${$fetchStatus})` : ''}
					</p>
					<div class="flex space-x-2">
						<button
							class="border-b-[1px] border-transparent p-1 text-sm text-gray-200"
							class:border-b-gray-700={activeTab === 'Editor'}
							on:click={() => {
								activeTab = 'Editor';
							}}>Pretty</button
						>
						<button
							class="border-b-[1px] border-transparent p-1 text-sm text-gray-200"
							class:border-b-gray-700={activeTab === 'Headers'}
							on:click={() => {
								activeTab = 'Headers';
							}}>Headers ({Object.keys($fetchResult.headers).length})</button
						>
					</div>
				</div>
			{/if}
			<div class="relative">
				{#if $fetchResult}
					{#if activeTab === 'Editor'}
						{#await import('$lib/components/editor.svelte') then module}
							<svelte:component this={module.default} />
						{/await}
					{:else if activeTab === 'Headers'}
						<div
							class="mt-2 max-h-[588px] max-w-full overflow-y-scroll"
							class:p-1={activeTab === 'Headers'}
						>
							{#await import('$lib/components/resultHeaders.svelte') then module}
								<svelte:component this={module.default} />
							{/await}
						</div>
					{/if}
				{:else}
					<div class="flex h-[600px] w-full items-center justify-center rounded-sm">
						{#if !$reqLoading}
							<div class="flex flex-col items-center space-y-2">
								<p class="text-white">CTRL + L (Focus URL)</p>
								<p class="text-white">CTRL + S (Toggle Vim Mode)</p>
							</div>
						{/if}
					</div>
				{/if}
				{#if $reqLoading}
					<div class="absolute inset-0 h-full w-full bg-black/30">
						<div class="flex h-full w-full items-center">
							<div class="flex w-full flex-col items-center space-y-2">
								<Loader class="h-12 w-12 animate-spin text-white" />
								<button class="bg-white px-4 py-1 text-sm text-black">Cancel</button>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
