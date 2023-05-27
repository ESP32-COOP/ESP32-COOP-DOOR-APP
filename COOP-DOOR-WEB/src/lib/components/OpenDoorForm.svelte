<script lang="ts">
	import { writeOpenDoor } from '$lib/script/BLE';
	import { openDoor } from '../../stores';
	import type { DoorCondidtionDTO } from '../../types/openDoorDTO';
	import LightInput from './LightInput.svelte';
	import OptionBadge from './OptionBadge.svelte';
	import TimeInput from './TimeInput.svelte';

	let localOpenSettings: DoorCondidtionDTO;

	const unsubscribe = openDoor.subscribe((value) => localOpenSettings = value)

	$: console.log("localOpenSettings", localOpenSettings)


	function handleDoorOpen() {
		let mode = 0;
		mode = localOpenSettings.lightOption ? mode + 1 : mode;
		mode = localOpenSettings.timeOption ? mode + 2 : mode;
		mode = localOpenSettings.condition == 'OR' && mode != 0 ? mode : mode + 1;
		console.log("writeOpenDoor",mode, localOpenSettings.lightThreshold, localOpenSettings.timeThreshold)

		writeOpenDoor(mode, localOpenSettings.lightThreshold, localOpenSettings.timeThreshold.hour, 
		localOpenSettings.timeThreshold.minute);
	}
</script>

<div
	class="grid h-full w-full grid-cols-1 gap-5"
	style="grid-template-rows : 2.5fr 5fr .5fr 5fr 2fr ;"
>
	<div
		class="grid grid-cols-2 items-center gap-2 rounded-xl bg-slate-50 p-1"
		style="grid-template-columns : 4rem 1fr ;"
	>
		<h3 class="ml-2">option</h3>
		<div class="flex h-full w-full flex-row gap-2">
			<OptionBadge icon="light" hint="light" bind:active={localOpenSettings.lightOption} />
			<OptionBadge icon="clock" hint="time" bind:active={localOpenSettings.timeOption} />
		</div>
	</div>

	<LightInput
		bind:active={localOpenSettings.lightOption}
		bind:value={localOpenSettings.lightThreshold}
		direction="upper"
	/>

	<div class=" flex items-center">
		<select
			bind:value={localOpenSettings.condition}
			class="ml-5 rounded-md bg-slate-500 px-2 uppercase text-white"
		>
			<option value="AND">and</option>
			<option value="OR">or</option>
		</select>
	</div>
	<TimeInput
		bind:active={localOpenSettings.timeOption}
		bind:value={localOpenSettings.timeThreshold}
	/>

	<button on:click={handleDoorOpen} class="rounded-xl bg-slate-50 text-2xl font-bold uppercase"
		>apply</button
	>
</div>
