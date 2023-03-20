<script lang="ts">
	import OptionBadge from '$lib/components/OptionBadge.svelte';
	import LightInput from '$lib/components/LightInput.svelte';
	import TimeInput from '$lib/components/TimeInput.svelte';
	import RadioButton from '$lib/components/RadioButton.svelte';
	import { onMount } from 'svelte';
	import { readCloseDoor, readDoor, readOpenDoor, writeCloseDoor, writeDoor, writeOpenDoor } from '$lib/script/BLE';
	interface LightSettings {
		active: boolean;
		value: number;}

	interface ClockSettings {
		active: boolean;
		value: any;}

	interface DoorSettings {
		nbTurn: number;
		mode: 0|1|2|3;}

	interface Settings {
		close: {
			light: LightSettings;
			clock: ClockSettings;
			condition: 'and'|'or';
		};
		open: {
			light: LightSettings;
			clock: ClockSettings;
			condition: 'and'|'or';
		};
		door: DoorSettings;}

	let settings: Settings = {
		close: {
			light: { active: false, value: 200 },
			clock: { active: false, value: '20:30' },
			condition: 'or',
		},
		open: {
			light: { active: false, value: 200 },
			clock: { active: false, value: '20:30' },
			condition: 'or',
		},
		door: { nbTurn: 5, mode: 0 }};
	let page: string | null = 'close';
	page = sessionStorage.getItem('page');
	page = page == null ? 'close' : page;

	$: sessionStorage.setItem('page', page == null ? 'close' : page);

	onMount(async () => {
		readDoor()
		.then(data =>{
			settings.door.nbTurn = data[0];
			settings.door.mode = data[1] as 0|1|2|3;
		})

		readCloseDoor()
		.then(data =>{
			settings.close.light.value = data[1];
			settings.close.clock.value = (data[2]<10?"0"+data[2]:data[2])+":"+data[3];
			settings.close.light.active =  data[0] == 0 || data[0] == 2?false:true;
			settings.close.clock.active =  data[0] == 0 || data[0] == 1?false:true;
			settings.close.condition =  data[0] == 4 ?'and':'or';

		})

		readOpenDoor()
		.then(data =>{
			settings.open.light.value = data[1];
			settings.open.clock.value = (data[2]<10?"0"+data[2]:data[2])+":"+data[3];
			settings.open.light.active =  data[0] == 0 || data[0] == 2?false:true;
			settings.open.clock.active =  data[0] == 0 || data[0] == 1?false:true;
			settings.open.condition =  data[0] == 4 ?'and':'or';

		})

	});

	function setDoorValue(event: MouseEvent | null, nbTurn:number =settings.door.nbTurn, mode:0|1|2|3=settings.door.mode) {
		console.log('door values.. ', nbTurn, mode);
		writeDoor(nbTurn, mode);
	}

	function testDoor(){
		setDoorValue(null, settings.door.nbTurn,3)
	}

	function handleDoorClose(){
		const [hourString, minuteString] = settings.close.clock.value.split(':');
		const hour = parseInt(hourString, 10);
		const minute = parseInt(minuteString, 10);
		let mode = 0;
		mode = settings.close.light.active? mode+1:mode;
		mode = settings.close.clock.active? mode+2:mode;
		mode = settings.close.condition=='or' && mode!=0?mode:mode+1 ;
		console.log("mode",mode,"light",settings.close.light.value, "hour", hour,"minute",minute)
		writeCloseDoor(mode,settings.close.light.value,hour,minute  )

	}

	function handleDoorOpen(){
		const [hourString, minuteString] = settings.open.clock.value.split(':');
		const hour = parseInt(hourString, 10);
		const minute = parseInt(minuteString, 10);
		let mode = 0;
		mode = settings.open.light.active? mode+1:mode;
		mode = settings.open.clock.active? mode+2:mode;
		mode = settings.open.condition=='or' && mode!=0?mode:mode+1 ;
		console.log("mode",mode,"light",settings.open.light.value, "hour", hour,"minute",minute)
		writeOpenDoor(mode,settings.open.light.value,hour,minute  )

	}
</script>

<div class="grid h-screen grid-cols-1 p-2 " style="grid-template-rows : 1fr 1fr 11fr ;">
	<div class="flex h-full w-full flex-row items-center">
		<a class="" href="/device">
			<div class=" m-2 ml-8 h-fit rounded-full bg-slate-300 bg-opacity-80 p-2">
				<img class="h-6 w-6 rotate-180 p-1" src="arrow.svg" alt="gear" />
			</div>
		</a>
	</div>
	<h1 class="ml-8 text-3xl uppercase">coop <span class="font-bold">settings</span></h1>
	<div class="flex h-full w-full items-center justify-center">
		<div
			class="grid h-4/5 w-4/5 grid-cols-1 gap-5 rounded-2xl bg-slate-300 p-5 opacity-70"
			style="grid-template-rows : 1.5fr 15fr ;"
		>
			<!--15fr-->
			<!-- nav-->
			<div class="flex items-baseline  justify-start gap-2 border-b-2 border-slate-500 ">
				<button
					class="rounded-xl p-1 px-3 {page == 'close'
						? 'h-full rounded-b-none  bg-slate-500  text-white'
						: 'h-[80%] bg-slate-50'} "
					on:click={() => (page = 'close')}>close</button
				>
				<button
					class="rounded-xl p-1 px-3 {page == 'open'
						? 'h-full rounded-b-none  bg-slate-500  text-white'
						: 'h-[80%] bg-slate-50'} "
					on:click={() => (page = 'open')}>open</button
				>
				<button
					class="rounded-xl p-1 px-3 {page == 'door'
						? 'h-full rounded-b-none  bg-slate-500  text-white'
						: 'h-[80%] bg-slate-50'} "
					on:click={() => (page = 'door')}>door</button
				>
			</div>
			<!-- nav end-->

			<!-- main menu-->

			{#if page == 'close'}
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
							<OptionBadge icon="light" hint="light" bind:active={settings.close.light.active} />
							<OptionBadge icon="clock" hint="time" bind:active={settings.close.clock.active} />
						</div>
					</div>

					<LightInput
						bind:active={settings.close.light.active}
						bind:value={settings.close.light.value}
						direction="lower"
					/>

					<div class=" flex items-center">
						<select bind:value={settings.close.condition} class="ml-5 rounded-md bg-slate-500 px-2 uppercase text-white">
							<option>and</option>
							<option>or</option>
						</select>
					</div>
					<TimeInput
						bind:active={settings.close.clock.active}
						bind:value={settings.close.clock.value}
					/>

					<button on:click={handleDoorClose} class="rounded-xl bg-slate-50 text-2xl font-bold uppercase">apply</button>
				</div>
			{:else if page == 'open'}
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
							<OptionBadge icon="light" hint="light" bind:active={settings.open.light.active} />
							<OptionBadge icon="clock" hint="time" bind:active={settings.open.clock.active} />
						</div>
					</div>

					<LightInput
						bind:active={settings.open.light.active}
						bind:value={settings.open.light.value}
						direction="upper"
					/>

					<div class=" flex items-center">
						<select bind:value={settings.open.condition} class="ml-5 rounded-md bg-slate-500 px-2 uppercase text-white">
							<option>and</option>
							<option>or</option>
						</select>
					</div>
					<TimeInput
						bind:active={settings.open.clock.active}
						bind:value={settings.open.clock.value}
					/>

					<button on:click={handleDoorOpen} class="rounded-xl bg-slate-50 text-2xl font-bold uppercase">apply</button>
				</div>
			{:else if page == 'door'}
				<div
					class="grid h-full w-full grid-cols-2 gap-5 "
					style="grid-template-columns : 1fr 1.5fr ;"
				>
					<div class="grid h-full w-full grid-cols-1 gap-5" style="grid-template-rows: 4fr 1fr">
						<div class="relative flex  items-center justify-center rounded-xl bg-slate-50">
							<input
								bind:value={settings.door.nbTurn}
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
									style="height: {settings.door.nbTurn * 10}%;"
								/>
							</div>
						</div>
						<div class="flex flex-col items-center justify-center rounded-xl bg-slate-50">
							<h3 class="text-3xl">{settings.door.nbTurn}</h3>
							<p>turns</p>
						</div>
					</div>
					<div class="grid h-full w-full grid-cols-1 gap-5" style="grid-template-rows: 4fr 1fr">
						<RadioButton bind:mode={settings.door.mode} />
						<div class="grid h-full w-full grid-cols-2 gap-5 ">
							<button on:click={testDoor} class="rounded-xl bg-slate-50 font-bold uppercase">test</button>
							<button on:click={setDoorValue} class="rounded-xl bg-slate-50 font-bold uppercase"
								>apply</button
							>
						</div>
					</div>
				</div>
			{:else}
				<p>error</p>
			{/if}

			<!-- main end-->
		</div>
	</div>
</div>
