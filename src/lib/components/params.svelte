<script lang="ts">
	import { endpoint } from "$lib/stores";
	import type { Params } from "$lib/types";
	import { Check, Plus, Trash2 } from "lucide-svelte";

	export let optionsCount: any;

	let value: Params[] = [
		{
			id: "awdin2i",
			key: "",
			value: "",
			checked: true
		}
	];
	let debounceTimer: number;

	function addParams() {
		const id = Math.random().toString(36).substring(2, 15);
		value = [...value, { id, key: "", value: "", checked: true }];
		optionsCount.parameters = value.length;
	}

	function handleChange() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			mergeParams();
		}, 250);
	}

	function mergeParams() {
		//TODO: handle ? in url when checked and deleted run
		$endpoint =
			"?" +
			new URLSearchParams(
				value.reduce(
					(acc, { key, value, checked }) => {
						if (checked) {
							if (key && value) acc[key] = value;
							return acc;
						}
						return acc;
					},
					{} as Record<string, string>
				)
			).toString();
	}

	$: console.log("endpoint is", $endpoint);
	$: console.log("value is", value);
</script>

<div class="grid grid-cols-12 justify-between border-[1px] border-gray-800 text-white">
	<div class="col-span-4 border-r-[1px] border-gray-800 p-2 text-gray-400">Key</div>
	<div class="col-span-8 p-2 text-gray-400">Value</div>
</div>
{#each value as param}
	<div class="grid grid-cols-12 justify-between border-[1px] border-gray-800">
		<div class="col-span-4 border-r-[1px] border-gray-800">
			<input
				class="w-full bg-transparent p-2 text-white focus:outline-none"
				bind:value={param.key}
				on:change={handleChange}
			/>
		</div>
		<div class="col-span-6 border-r-[1px] border-gray-800 border-r-gray-800">
			<input
				class="w-full bg-transparent p-2 text-white focus:outline-none"
				bind:value={param.value}
				on:change={handleChange}
			/>
		</div>
		<div class="col-span-1 flex items-center justify-center border-r-[1px] border-r-gray-800">
			<div class="inline-flex items-center justify-center">
				<button
					class="flex h-6 w-6 items-center justify-center rounded-full border-[1px] border-gray-800"
					class:bg-green-700={param.checked}
					on:click={() => {
						param.checked = !param.checked;
						handleChange();
					}}
				>
					{#if param.checked}
						<Check class="h-4 w-4 text-green-100" />
					{/if}
				</button>
			</div>
		</div>
		<div class="col-span-1 flex items-center justify-center">
			<div class="inline-flex items-center justify-center">
				<button
					class="flex h-6 w-6 items-center justify-center rounded-full"
					on:click={() => {
						value = value.filter((p) => p.id !== param.id);
						optionsCount.parameters = value.length;
						handleChange();
					}}
				>
					<Trash2 class="h-4 w-4 text-red-400" />
				</button>
			</div>
		</div>
	</div>
{/each}

<button class="mt-4 flex items-center space-x-1 text-sm text-green-100" on:click={addParams}>
	<Plus class="h-3 w-3" />
	<span>Add Parameters</span>
</button>
