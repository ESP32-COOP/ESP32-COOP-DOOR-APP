<script lang="ts">
	import { goto } from '$app/navigation';
	import SmallBadge from '$lib/components/SmallBadge.svelte';
	import { isDeviceConnected, readDate } from '$lib/script/BLE';
	import { onDestroy, onMount } from 'svelte';

	let count = 1;
	let deviceDate = new Date();
	const options: Intl.DateTimeFormatOptions = {
		timeZone: 'Europe/Paris',
		hour12: false,
		hour: '2-digit',
		minute: '2-digit'
	};
	let timeoutId: NodeJS.Timeout | null = null;

	const lightSmallBadgeData = {
		title: 'Light Sensor',
		subTitle: 'britness level',
		subTitleType: 'value',
		value: count,
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
	});

	onDestroy(() => {
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
		}
	});

	async function updateDate() {
		if (!isDeviceConnected()) {
			goto('/');
		}
		let value = await readDate();
		if (value) {
			deviceDate = new Date(value * 1000);
			console.log(
				'reading date device page...',
				value,
				new Date(value * 1000).toLocaleTimeString('en-US', options)
			);
		}
		timeoutId = setTimeout(() => updateDate(), 10000);
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
		<SmallBadge {...lightSmallBadgeData} value={count} />
		<SmallBadge {...dateSmallBadgeData} value={deviceDate} />
	</div>
</div>
