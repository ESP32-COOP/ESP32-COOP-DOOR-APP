<script lang="ts">
	import { goto } from '$app/navigation';
	import SmallBadge from '$lib/components/SmallBadge.svelte';
	import { isDeviceConnected, readDate, readLight } from '$lib/script/BLE';
	import { onDestroy, onMount } from 'svelte';
	import Popup from '$lib/components/Popup.svelte';

	let deviceValue = 1;
	let deviceDate = new Date();
	const options: Intl.DateTimeFormatOptions = {
		timeZone: 'Europe/Paris',
		hour12: false,
		hour: '2-digit',
		minute: '2-digit'
	};
	let timeoutIdDate: NodeJS.Timeout | null = null;
	let timeoutIdLight: NodeJS.Timeout | null = null;
	let deviceConnected: Boolean | BluetoothRemoteGATTServer = true

	$: timeoutIdDate, timeoutIdLight,  deviceConnected = isDeviceConnected()

	const lightSmallBadgeData = {
		title: 'Light Sensor',
		subTitle: 'britness level',
		subTitleType: 'value',
		value: deviceValue,
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
			clearTimeout(timeoutIdDate);
		}
		if (timeoutIdLight !== null) {
			clearTimeout(timeoutIdLight);
		}
	});

	async function updateLight() {
		readLight()
			.then((value) => {
				deviceValue = value[0];
				console.log('reading light D...', deviceValue);
			})
			.catch((error) => {
				console.log('Light not Updated..', error);
			})
			.finally(() => {
				timeoutIdLight = setTimeout(() => updateLight(), 2000);
			});
	}

	async function updateDate() {
		let value = await readDate();
		if (value) {
			deviceDate = new Date(value * 1000);

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
		<SmallBadge {...lightSmallBadgeData} value={deviceValue} />
		<SmallBadge {...dateSmallBadgeData} value={deviceDate} />
	</div>
</div>
{#if !deviceConnected }
<Popup message={'The device is disconnected ...'} redirect={"/"}/>
{/if}