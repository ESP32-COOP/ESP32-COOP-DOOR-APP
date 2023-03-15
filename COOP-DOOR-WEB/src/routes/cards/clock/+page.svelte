<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		readDate,
		writeDate,
		getDevice,
		localBLE,
		getLongFromBytesBuffer
	} from '$lib/script/BLE';
	import { onDestroy, onMount } from 'svelte';

	let datePhone = new Date();
	let dateDevice = new Date(datePhone.getTime() + 2 * 60000);
	const options: Intl.DateTimeFormatOptions = {
		timeZone: 'Europe/Paris',
		hour12: false,
		hour: '2-digit',
		minute: '2-digit'
	};

	

	function handleChangedValue(ev: Event) {
        const characteristic = ev.target as BluetoothRemoteGATTCharacteristic;
        const value = characteristic.value as DataView;
        dateDevice = new Date(getLongFromBytesBuffer(value)*1000);
	}

	

	onMount(async () => {
        if (localBLE.device && localBLE.GATT && localBLE.dateChar) {
            localBLE.dateChar.addEventListener('characteristicvaluechanged', handleChangedValue);
            localBLE.dateChar?.startNotifications();
        }
		 
	});

	onDestroy(async () => {
		if (localBLE.dateChar) {
            localBLE.dateChar.removeEventListener('characteristicvaluechanged', handleChangedValue);
            await localBLE.dateChar.stopNotifications();
        }
	});

    $:dateDevice, datePhone = new Date();

    updateDate();
	async function updateDate() {
		let value = await readDate();
		if (value) {
			dateDevice = new Date(value * 1000);
		}
	}

	function sync() {
		console.log('syncing...');
		writeDate()
			.then((res) => {
				console.log('updated!', res);
			})
			.catch((error) => {
				console.log('failed', error);
			})
			.finally(() => {
				setTimeout(() => updateDate(), 1000);
			});
	}
</script>

<h1 class="ml-8 text-3xl uppercase">date <span class="font-bold">time</span></h1>
<div class="flex h-full w-full items-center justify-center">
	<div
		class="grid h-[60%] w-4/5 grid-cols-1 gap-5 rounded-2xl bg-slate-300 p-5 opacity-70"
		style="grid-template-rows : 5fr 2fr 2fr "
	>
		<div class=" grid h-full w-full grid-cols-2 gap-5 rounded-xl">
			<div class="flex h-full w-full flex-col items-center justify-around rounded-xl bg-slate-50">
				<h2 class="text-5xl">{dateDevice.toLocaleTimeString('en-US', options)}</h2>

				<h3 class="text-2xl">
					{dateDevice.getDay()}/{dateDevice.getMonth()}/{dateDevice.getFullYear()}
				</h3>
				<p class="text-black/80">device</p>
			</div>

			<div class="flex h-full w-full flex-col items-center justify-around rounded-xl bg-slate-50">
				<h2 class="text-5xl">{datePhone.toLocaleTimeString('en-US', options)}</h2>
				<h3 class="text-2xl">
					{datePhone.getDay()}/{datePhone.getMonth()}/{datePhone.getFullYear()}
				</h3>
				<p class="text-black/80">phone</p>
			</div>
		</div>

		<div
			class="grid grid-cols-2 items-center justify-center gap-5 rounded-xl bg-slate-50 "
			style="grid-template-columns : 2fr 8fr ;"
		>
			<p class="ml-2  w-fit">delta :</p>
			<h4 class="text-3xl text-red-500">
				{((dateDevice.getTime() - datePhone.getTime()) / 60000).toFixed(3)} min
			</h4>
		</div>

		<button on:click={sync} class="rounded-xl bg-slate-50 text-xl font-semibold uppercase">
			sync device
		</button>
	</div>
</div>
