<script lang="ts">
	import { Loader } from 'lucide-svelte';
	import Editor from '$lib/components/editor.svelte';
	import Header from '$lib/components/header.svelte';
	import UrlBar from '$lib/components/urlBar.svelte';
	import { fetchStatus, reqLoading, fetchResult, keyDownEvent } from '$lib/stores';
	import { onMount, onDestroy } from 'svelte';

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
		<UrlBar />
		<div
			class="flex w-full flex-col space-y-1 rounded-sm border-[1px] border-gray-800 bg-gray-900 p-1 shadow"
		>
			{#if $fetchResult}
				<div class="flex space-x-1">
					<p
						class="inline-flex w-fit justify-center p-1.5 text-sm text-white"
						class:bg-blue-900={$fetchResult.status >= 200 && $fetchResult.status < 400}
						class:bg-red-600={$fetchResult.status >= 400 && $fetchResult.status < 600}
					>
						{$fetchResult ? `${$fetchResult.status} (${$fetchStatus})` : ''}
					</p>
					<span class="text-sm text-white">Headers {Object.keys($fetchResult.headers).length}</span>
				</div>
			{/if}
			<div class="relative">
				{#if $fetchResult}
					<Editor />
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
