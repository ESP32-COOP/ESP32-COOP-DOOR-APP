<script lang="ts">
	import { readDoor, readCloseDoor, readOpenDoor, writeDoor } from '$lib/script/BLE';
	import { onMount } from 'svelte';
	import RadioButton from './RadioButton.svelte';
	import type { doorSettingsDTO } from '../../types/doorSettingsDTO';
	import { doorSettings, showToast } from '../../stores';
	import type { DoorMode } from '../../types/doorMode';
	import { areDictionariesEqual } from '$lib/script/Utils';

	let localDoorSettings: doorSettingsDTO;
	let localDoorSettingsReference: doorSettingsDTO;
	let unsaved: boolean = false;

	const unsubscribe = doorSettings.subscribe((value) => {
		localDoorSettings = value;
		localDoorSettingsReference = {...value};
	});

	onMount(async () => {
		readDoor()
			.then((data) => {
				console.debug('door data', data);
				doorSettings.set({ nbTurn: data[0], mode: data[1] as DoorMode });
			})
			.catch((error) => {
				console.error('readDoor', error);
			});
	});
 
	function setDoorValue(
		event: MouseEvent | null,
		nbTurn: number = localDoorSettings.nbTurn,
		mode: DoorMode = localDoorSettings.mode
	) {
		console.log('door values.. ', nbTurn, mode);

		writeDoor(nbTurn, mode)
			.then((_) => {
				showToast({ type: 'success', message: 'Success: Values sent', duration: 2000 });
				doorSettings.set(localDoorSettings);
				unsaved = false;
			})
			.catch((error) => {
				console.log('failed', error);
				showToast({ type: 'error', message: error });
			});
	}

	function testDoor() {
		setDoorValue(null, localDoorSettings.nbTurn, 2);
	}

	function statusChanged() {
		unsaved = !areDictionariesEqual(localDoorSettings , localDoorSettingsReference)
	}

	$: localDoorSettings.nbTurn, localDoorSettings.mode, statusChanged()
</script>

<div class="grid h-full w-full grid-cols-2 gap-5 " style="grid-template-columns : 1fr 1.5fr ;">
	<div class="grid h-full w-full grid-cols-1 gap-5" style="grid-template-rows: 4fr 1fr">
		<div class="relative flex  items-center justify-center rounded-xl bg-slate-50">
			<input
				bind:value={localDoorSettings.nbTurn}
				min="1"
				max="10"
				step="0.2"
				type="range"
				class="z-10 h-full   w-full opacity-0 "
				style=" -webkit-appearance: slider-vertical;"
			/>
			<!--mozila sepcial orient="vertical" -->
			<div class="absolute flex h-full w-full flex-col justify-end p-2">
				<div
					class="w-full rounded-xl bg-slate-500 transition-all"
					style="height: {localDoorSettings.nbTurn * 10}%;"
				/>
			</div>
		</div>
		<div class="flex flex-col items-center justify-center rounded-xl bg-slate-50">
			<h3 class="text-3xl">{localDoorSettings.nbTurn}</h3>
			<p>turns</p>
		</div>
	</div>
	<div class="grid h-full w-full grid-cols-1 gap-5" style="grid-template-rows: 4fr 1fr">
		<RadioButton bind:mode={localDoorSettings.mode} />
		<div class="grid h-full w-full grid-cols-2 gap-5 ">
			<button on:click={testDoor} class="rounded-xl bg-slate-50 font-bold uppercase">test</button>
			<button
				on:click={setDoorValue}
				class="rounded-xl bg-slate-50 font-bold uppercase"
				class:bg-slate-500={unsaved}
				class:text-white={unsaved}>apply</button
			>
		</div>
	</div>
</div>
