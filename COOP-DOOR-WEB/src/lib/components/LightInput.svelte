<script lang="ts">
    export let active:boolean = true;
    export let direction:string = "lower";
    export let value =200;

</script>

<div
	class="grid grid-cols-3 items-center gap-5 rounded-xl bg-slate-50 p-3 {active ? "" : "opacity-50" }"
	style="grid-template-columns : 1fr 1fr 1fr ;"
>
	<div class="flex justify-center items-center w-full h-full">
		<img class="w-auto h-full" src="/light.svg" alt="light" />
	</div>
	<div class="flex justify-center items-center w-full h-full">
		<img class=" w-7 {direction == "lower" ? "rotate-180" : ""} " src="/arrow.svg" alt="arrow" />
	</div>
	<input
		class="p-2 w-full text-xl font-bold text-white rounded-xl bg-slate-500"
		type="number"
		bind:value={value}
        disabled = {!active}
	/>
</div>
