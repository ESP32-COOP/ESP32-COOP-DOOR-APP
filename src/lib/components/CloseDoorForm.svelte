<script lang="ts">
	import { readCloseDoor, writeCloseDoor } from '$lib/script/BLE';
	import { onMount } from 'svelte';
	import { closeDoor, openDoor } from '../../stores';
	import type { DoorConditionDTO } from '../../types/doorCondition';
	import LightInput from './LightInput.svelte';
	import OptionBadge from './OptionBadge.svelte';
	import TimeInput from './TimeInput.svelte';

	let localCloseSettings: DoorConditionDTO;

	const unsubscribe = closeDoor.subscribe((value) => (localCloseSettings = value));

	$: console.log('localOpenSettings', localCloseSettings);

	function handleDoorClose() {
		let mode = 0;
		mode = localCloseSettings.lightOption ? mode + 1 : mode;
		console.debug('mode', mode);
		mode = localCloseSettings.timeOption ? mode + 2 : mode;
		console.debug('mode', mode);
		mode = localCloseSettings.condition == 'OR' && mode === 3 ? mode + 1 : mode;
		console.debug('mode', mode);
		console.log('mode', localCloseSettings);
		writeCloseDoor(
			mode,
			Math.floor(localCloseSettings.lightThreshold/4),
			localCloseSettings.timeThreshold.hour,
			localCloseSettings.timeThreshold.minute
		);
	}

	onMount(async () => {
		closeDoor.set(await readCloseDoor());
	});
</script>

<div
	class="grid h-full max-h-full w-full grid-cols-1 gap-2 overflow-hidden"
	style="grid-template-rows : 2.5fr 5fr .5fr 5fr 2fr ;"
>
	<div
		class="grid grid-cols-2 items-center gap-2 rounded-xl bg-slate-50 p-1"
		style="grid-template-columns : 4rem 1fr ;"
	>
		<h3 class="ml-2">option</h3>
		<div class="flex h-full w-full flex-row gap-2">
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
			class="ml-5 rounded-md bg-slate-500 px-2 uppercase text-white"
		>
			<option value="AND">and</option>
			<option value="OR">or</option>
		</select>
	</div>
	<TimeInput
		bind:active={localCloseSettings.timeOption}
		bind:value={localCloseSettings.timeThreshold}
	/>

	<button on:click={handleDoorClose} class="rounded-xl bg-slate-50 text-2xl font-bold uppercase"
		>apply</button
	>
</div>
