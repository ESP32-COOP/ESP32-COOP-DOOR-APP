<script lang="ts">
	import { readOpenDoor, writeOpenDoor } from '$lib/script/BLE';
	import { onMount } from 'svelte';
	import { openDoor, showToast } from '../../stores';
	import type { DoorConditionDTO } from '../../types/doorCondition';
	import LightInput from './LightInput.svelte';
	import OptionBadge from './OptionBadge.svelte';
	import TimeInput from './TimeInput.svelte';
	import { areDictionariesEqual } from '$lib/script/Utils';

	let localOpenSettings: DoorConditionDTO;
	let localOpenSettingsReference: DoorConditionDTO;
	let unsaved = false;


	const unsubscribe = openDoor.subscribe((value) => {
		console.log("subscritpnio", localOpenSettings, openDoor)
		localOpenSettings = value ;
		localOpenSettingsReference = {...value};
	});


	function handleDoorOpen() {
		let mode = 0;
		mode = localOpenSettings.lightOption ? mode + 1 : mode;
		mode = localOpenSettings.timeOption ? mode + 2 : mode;
		mode = localOpenSettings.condition == 'OR' && mode === 3 ? mode + 1 : mode;
		console.log(
			'writeOpenDoor',
			mode,
			localOpenSettings.lightThreshold,
			localOpenSettings.timeThreshold
		);

		writeOpenDoor(
			mode,
			localOpenSettings.lightThreshold,
			localOpenSettings.timeThreshold.hour,
			localOpenSettings.timeThreshold.minute
		)
			.then((_) => {
				showToast({ type: 'success', message: 'Success: Values sent', duration: 2000 });
				openDoor.set(localOpenSettings);
				unsaved = false;
			})
			.catch((error) => {
				console.log('failed', error);
				showToast({ type: 'error', message: error });
			});
		
	}

	function statusChanged() {
		unsaved = !areDictionariesEqual(localOpenSettings , localOpenSettingsReference)
	}

	$: localOpenSettings.lightOption,
		localOpenSettings.lightThreshold,
		localOpenSettings.condition,
		localOpenSettings.timeOption,
		localOpenSettings.timeThreshold.hour,
		localOpenSettings.timeThreshold.minute,
		statusChanged(), console.log("reactive ",localOpenSettings,localOpenSettingsReference, areDictionariesEqual(localOpenSettings, localOpenSettingsReference),"unsaved",unsaved);

	onMount(async () => {
		openDoor.set(await readOpenDoor());
	});
</script>

<div
	class="grid h-full w-full grid-cols-1 gap-2 overflow-hidden"
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

	<div class="flex items-center">
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

	<button
		on:click={handleDoorOpen}
		class="rounded-xl bg-slate-50 text-2xl font-bold uppercase"
		class:bg-slate-500={unsaved}
		class:text-white={unsaved}>apply</button
	>
</div>
