<script lang="ts">
	import type { SvelteComponent } from "svelte";

	const tabsOptions = ["parameters", "headers", "body", "authentication"];
	const wording = {
		parameters: "Parameters",
		headers: "Headers",
		body: "Body",
		authentication: "Authentication"
	};

	let activeTab = "parameters";
	let Component: typeof SvelteComponent;
	let Params: typeof SvelteComponent;

	let optionsCount = {
		parameters: 0,
		headers: 0
	};

	$: if (activeTab) {
		(async () => {
			switch (activeTab) {
				case "parameters":
					activeTab = "parameters";
					if (!Params) {
						Params = (await import("$lib/components/params.svelte"))
							.default as unknown as typeof SvelteComponent;
					}
					Component = Params;
					break;
				case "headers":
					activeTab = "headers";
					break;
				case "body":
					activeTab = "body";
					break;
				case "authentication":
					activeTab = "authentication";
					break;
			}
		})();
	}
</script>

<div class="mt-4 flex w-full space-x-2">
	{#each tabsOptions as tab}
		<button
			class="inline-flex items-center justify-center space-x-1 border-b-[1px] border-transparent p-1 text-sm text-gray-200"
			class:border-b-gray-700={activeTab === tab}
			on:click={() => {
				activeTab = tab;
			}}
		>
			<span>{wording[tab]}</span>
			{#if optionsCount[tab]}
				<div class="h-4 w-4 bg-gray-700/20 text-xs">
					{optionsCount[tab] ? optionsCount[tab] : ""}
				</div>
			{/if}
		</button>
	{/each}
</div>
<div class="mt-2">
	<svelte:component this={Component} bind:optionsCount />
</div>
