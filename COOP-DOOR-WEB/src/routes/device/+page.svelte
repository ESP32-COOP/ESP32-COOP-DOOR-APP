<script lang="ts">
	import { goto } from '$app/navigation';
	import SmallBadge from '$lib/components/SmallBadge.svelte';
	import { isDeviceConnected, readDate, readLight } from '$lib/script/BLE';
	import { onDestroy, onMount } from 'svelte';
	import Popup from '$lib/components/Popup.svelte';
	import type { LightDTO } from '../../types/lightDTO';
	import { date, light } from '../../stores';

	let deviceDate = new Date();
	const options: Intl.DateTimeFormatOptions = {
		timeZone: 'Europe/Paris',
		hour12: false,
		hour: '2-digit',
		minute: '2-digit'
	};
	let timeoutIdDate: NodeJS.Timeout | null = null;
	let timeoutIdLight: NodeJS.Timeout | null = null;
	let deviceConnected: Boolean | BluetoothRemoteGATTServer = true;

	let lightValue: number = 0;
	let localDate: Date = new Date();

	const unsubscribeDate = date.subscribe((value) => localDate = value);
    const unsubscribeLight = light.subscribe((value) => lightValue = value.value);

	$: timeoutIdDate, timeoutIdLight,null,  deviceConnected = isDeviceConnected()

	const lightSmallBadgeData = {
		title: 'Light Sensor',
		subTitle: 'britness level',
		subTitleType: 'value',
		value: lightValue,
		badgeType: 'dark',
		link: 'cards/light'
	};

	const dateSmallBadgeData = {
		title: 'Date Time',
		subTitle: 'britness level',
		subTitleType: 'value',
		icon: 'clock',
		link: 'cards/clock'
	};

	onMount(async () => {
		await updateDate();
		await updateLight();
	});

	onDestroy(() => {
		// If a timeout is still active, clear it when the component is destroyed
		if (timeoutIdDate !== null) {
			console.log("clear date timeout");
			clearTimeout(timeoutIdDate);
		}
		if (timeoutIdLight !== null) {
			console.log("clear light timeout");
			clearTimeout(timeoutIdLight);
		}
	});

	async function updateLight() {
		readLight()
			.then((value) => {
				light.set({value: value[0],min: value[1],max: value[2]})
				console.log('reading light D...', value[0]);
			})
			.catch((error) => {
				console.log('Light not Updated..', error);
			})
			.finally(() => {
				if (timeoutIdLight) clearTimeout(timeoutIdLight);
				timeoutIdLight = setTimeout(() => updateLight(), 5000);
			});
	}

	async function updateDate() {
		let value = await readDate();
		if (value) {
			date.set(new Date(value * 1000));

			console.log(
				'reading date D...',
				new Date(value * 1000).toLocaleTimeString('en-US', options)
			);
		}
		timeoutIdDate = setTimeout(() => updateDate(), 10000);
	}
</script>

<div class="grid h-screen grid-cols-1 p-2 " style="grid-template-rows : 1fr 1fr 8fr 3fr;">
	<div class="flex h-full w-full flex-row items-center">
		<a class="ml-auto" href="settings">
			<div class=" m-2 ml-auto h-fit rounded-full bg-slate-300 bg-opacity-80 p-2">
				<img src="gear.svg" alt="gear" />
			</div>
		</a>
	</div>

	<h1 class="ml-8 text-3xl uppercase">coop <span class="font-bold">door</span></h1>
	<div class="bg-[url('/coop.svg')] bg-center bg-no-repeat" />
	<div class="mx-4 grid    h-full w-auto grid-cols-2 gap-4">
		<SmallBadge {...lightSmallBadgeData} value={lightValue} />
		<SmallBadge {...dateSmallBadgeData} value={localDate} />
	</div>
</div>
{#if !deviceConnected }
<Popup message={'The device is disconnected ...'} redirect={"/"}/>
{/if}