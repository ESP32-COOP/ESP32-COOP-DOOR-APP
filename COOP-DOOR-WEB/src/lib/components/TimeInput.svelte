<script lang="ts">
	import { onMount } from "svelte";
	import type { Timestamp } from "../../types/doorCondition";

	export let active: boolean = true;
	export let value :Timestamp ;

	let selectedTime: string;

	function setDate(date: Timestamp){
		const hourString = date.hour.toString().padStart(2, "0");
		const minuteString = date.minute.toString().padStart(2, "0");
		selectedTime =  `${hourString}:${minuteString}`;
	}

	function getDate(){
		if (selectedTime){
			const [hourString, minuteString] = selectedTime.split(":");
			const hour = parseInt(hourString, 10);
			const minute = parseInt(minuteString, 10);
			value = {hour: hour, minute: minute}
		}
		
	}

	onMount(()=>{
		setDate(value);
	})
	

	//reactive
	$: selectedTime, getDate();
	$: setDate(value);


</script>

<div
	class="grid grid-cols-3 items-center gap-5 rounded-xl bg-slate-50 p-3  {active
		? ''
		: 'opacity-50'}"
	style="grid-template-columns : 1fr 1fr 1fr ;"
>
	<div class="flex justify-center items-center w-full h-full">
		<img class="w-auto h-full" src="clock.svg" alt="clock" />
	</div>
	<div class="flex justify-center items-center w-full h-full">
		<p class="font-bold">at</p>
	</div>
	<input
		class="p-2 w-full text-xl font-bold text-white rounded-xl bg-slate-500"
		type="time"
		bind:value={selectedTime}
		disabled={!active}
	/>
</div>
