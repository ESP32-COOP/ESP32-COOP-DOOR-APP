<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		readDate,
		writeDate,
		getDevice,
		localBLE,
		getLongFromBytesBuffer
	} from '$lib/script/BLE';
	import { betterTimeDisplay } from '$lib/script/Time';
	import { onDestroy, onMount } from 'svelte';
	import { date, showToast } from '../../../stores';
	import SnackBar from '$lib/components/SnackBar.svelte';

	let localDate: Date = new Date();

	const unsubscribe = date.subscribe((value) => localDate = value)

	let datePhone = new Date();

	const options: Intl.DateTimeFormatOptions = {
		timeZone: 'Europe/Paris',
		hour12: false,
		hour: '2-digit',
		minute: '2-digit'
	};

	

	function handleChangedValue(ev: Event) {
        const characteristic = ev.target as BluetoothRemoteGATTCharacteristic;
        const value = characteristic.value as DataView;
        date.set(new Date(getLongFromBytesBuffer(value)*1000));
		console.log("new value",getLongFromBytesBuffer(value))
	}

	

	onMount(async () => {
        initDateListener()
	});

	function initDateListener(){
		if (localBLE.device && localBLE.GATT && localBLE.dateChar) {
            localBLE.dateChar.addEventListener('characteristicvaluechanged', handleChangedValue);
            localBLE.dateChar?.startNotifications();
        }
	}

	onDestroy(async () => {
		if (localBLE.dateChar) {
            localBLE.dateChar.removeEventListener('characteristicvaluechanged', handleChangedValue);
            await localBLE.dateChar?.stopNotifications();
        }
	});

    $:localDate, datePhone = new Date();



	function sync() {
		console.log('syncing...');
		writeDate()
			.then((res) => {
				console.log('updated!', res,localBLE.dateChar);
			})
			.catch((error) => {
				console.log('failed', error);
				showToast({type:'error',message: error});
			})
			.finally(() => {
				initDateListener()
			})
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
				<h2 class="text-5xl">{localDate.toLocaleTimeString('en-US', options)}</h2>

				<h3 class="text-2xl">
					{localDate.getDay()}/{localDate.getMonth()}/{localDate.getFullYear()}
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
			{#if Math.abs(Math.floor((localDate.getTime() - datePhone.getTime()) / 1000)) < 60}
			<h4 class="text-3xl text-green-500 ">
				{ betterTimeDisplay(localDate.getTime() - datePhone.getTime())}
			</h4>
				
			{:else}
			<h4 class="text-3xl  text-red-500">
				{ betterTimeDisplay(localDate.getTime() - datePhone.getTime())} 
			</h4>

			{/if}
		
				
		</div>

		<button on:click={sync} class="rounded-xl bg-slate-50 text-xl font-semibold uppercase">
			sync device
		</button>
	</div>
</div>
<SnackBar  />