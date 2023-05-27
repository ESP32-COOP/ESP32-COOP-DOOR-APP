<script lang="ts">
	import { writeCloseDoor } from "$lib/script/BLE";
	import { closeDoor, openDoor } from "../../stores";
	import type { DoorCondidtionDTO } from "../../types/openDoorDTO";
	import LightInput from "./LightInput.svelte";
	import OptionBadge from "./OptionBadge.svelte";
	import TimeInput from "./TimeInput.svelte";


let localCloseSettings: DoorCondidtionDTO; 

const unsubscribe = closeDoor.subscribe((value) => localCloseSettings = value)

$: console.log("localOpenSettings", localCloseSettings)

	function handleDoorClose() {
		let mode = 0;
		mode = localCloseSettings.lightOption ? mode + 1 : mode;
		mode = localCloseSettings.timeOption ? mode + 2 : mode;
		mode = localCloseSettings.condition == 'OR' && mode != 0 ? mode : mode + 1;
		console.log('mode', localCloseSettings);
		writeCloseDoor(mode, localCloseSettings.lightThreshold, localCloseSettings.timeThreshold.hour, localCloseSettings.timeThreshold.minute);
	}
</script>

<div
	class="grid overflow-hidden grid-cols-1 gap-2 w-full h-full max-h-full"
	style="grid-template-rows : 2.5fr 5fr .5fr 5fr 2fr ;"
>
	<div
		class="grid grid-cols-2 gap-2 items-center p-1 rounded-xl bg-slate-50"
		style="grid-template-columns : 4rem 1fr ;"
	>
		<h3 class="ml-2">option</h3>
		<div class="flex flex-row gap-2 w-full h-full">
			<OptionBadge icon="light" hint="light" bind:active={localCloseSettings.lightOption} />
			<OptionBadge icon="clock" hint="time" bind:active={localCloseSettings.timeOption} />
		</div>
	</div>

	<LightInput
		bind:active={localCloseSettings.lightOption}
		bind:value={localCloseSettings.lightThreshold}
		direction="lower"
	/>

	<div class="flex items-center">
		<select
			bind:value={localCloseSettings.condition}
			class="px-2 ml-5 text-white uppercase rounded-md bg-slate-500"
		>
			<option value="AND">and</option>
			<option value="OR">or</option>
		</select>
	</div>
	<TimeInput bind:active={localCloseSettings.timeOption} bind:value={localCloseSettings.timeThreshold} />

	<button on:click={handleDoorClose} class="text-2xl font-bold uppercase rounded-xl bg-slate-50"
		>apply</button
	>
</div>
