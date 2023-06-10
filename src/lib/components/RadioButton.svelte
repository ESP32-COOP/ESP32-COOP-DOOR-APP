<script lang="ts">
	export let mode: 0|1|2|10|11 = 0;
</script>

<div class="grid h-full w-full grid-cols-1 gap-5">
	<button
		on:click={() => (mode = 1)}
		class="rounded-xl  font-bold uppercase {mode == 1 || mode == 11
			? 'bg-slate-500  text-white'
			: 'bg-slate-50 text-black'}">open</button
	>
	<button
	on:click={() => mode =0}
		class="rounded-xl  font-bold uppercase {mode == 0 || mode == 10
			? 'bg-slate-500  text-white'
			: 'bg-slate-50 text-black'}">close</button
	>
	<button
	on:click={() => mode = mode == 0? 10 : 11}
		class="rounded-xl font-bold uppercase {mode >= 10
			? 'bg-slate-500  text-white'
			: 'bg-slate-50 text-black'}">auto</button
	>
</div>
