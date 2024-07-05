<script lang="ts">
	import { fetchResult } from "$lib/stores";
</script>

<div class="grid grid-cols-12 gap-3">
	{#each Object.entries($fetchResult ? $fetchResult.headers : {}) as [key, value]}
		<p class="col-span-4 self-center text-sm text-gray-400">{key}</p>
		<p class="col-span-8 whitespace-pre-wrap text-wrap break-words text-sm text-gray-400">
			{value}
		</p>
	{/each}
</div>
