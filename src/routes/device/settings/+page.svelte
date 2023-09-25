<script lang="ts">
	import SnackBar from '$lib/components/SnackBar.svelte';
	import OpenDoorForm from '$lib/components/OpenDoorForm.svelte';
	import CloseDoorForm from '$lib/components/CloseDoorForm.svelte';
	import SettingsDoorForm from '$lib/components/SettingsDoorForm.svelte';
	import MoreSettingsForm from '$lib/components/MoreSettingsForm.svelte';

	type menuPage ='close' | 'open' | 'door' | 'more' | null;
	let page: menuPage  = 'close';
	page = sessionStorage.getItem('page') as menuPage ;
	page = page == null ? 'close' : page;

	$: sessionStorage.setItem('page', page == null ? 'close' : page);
</script>

<div class="grid grid-cols-1 p-2 h-screen" style="grid-template-rows : 1fr 1fr 11fr ;">
	<div class="flex flex-row items-center w-full h-full">
		<a class="" href="/device">
			<div class="p-2 m-2 ml-8 bg-opacity-80 rounded-full h-fit bg-slate-300">
				<img class="p-1 w-6 h-6 rotate-180" src="/arrow.svg" alt="gear" />
			</div>
		</a>
	</div>
	<h1 class="ml-8 text-3xl uppercase">coop <span class="font-bold">settings</span></h1>
	<div class="flex justify-center items-center w-full h-full">
		<div
			class="grid grid-cols-1 gap-5 p-5 w-4/5 h-4/5 rounded-2xl opacity-70 bg-slate-300"
			style="grid-template-rows : 1.5fr 15fr ;"
		>
			<!--15fr-->
			<!-- nav-->
			<div class="flex gap-2 justify-start items-baseline border-b-2 border-slate-500">
				<button
					class="rounded-xl h-full rounded-b-none p-1 px-3 {page === 'close'
						? '   bg-slate-500  text-white'
						: 'bg-slate-50'} "
					on:click={() => (page = 'close')}>close</button
				>
				<button
					class="rounded-xl h-full rounded-b-none p-1 px-3 {page === 'open'
						? '   bg-slate-500  text-white'
						: 'bg-slate-50'} "
					on:click={() => (page = 'open')}>open</button
				>
				<button
					class="rounded-xl h-full rounded-b-none p-1 px-3 {page === 'door'
						? '   bg-slate-500  text-white'
						: 'bg-slate-50'} "
					on:click={() => (page = 'door')}>door</button
				>
				<button
					class="rounded-xl ml-auto h-full rounded-b-none p-1 px-3 {page === 'more'
						? '   bg-slate-500  text-white'
						: 'bg-slate-50'} "
					on:click={() => (page = 'more')}>more</button
				>
			</div>
			<!-- nav end-->

			<!-- main menu-->

			{#if page == 'close'}
				<CloseDoorForm />
			{:else if page == 'open'}
				<OpenDoorForm />
			{:else if page == 'door'}
				<SettingsDoorForm />
			{:else if page == 'more'}
				<MoreSettingsForm />
			{:else}
				<p>error</p>
			{/if}

			<!-- main end-->
		</div>
	</div>
</div>
<SnackBar  />
