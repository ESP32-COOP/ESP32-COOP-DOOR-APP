<script lang="ts">
	import SnackBar from '$lib/components/SnackBar.svelte';
	import OpenDoorForm from '$lib/components/OpenDoorForm.svelte';
	import CloseDoorForm from '$lib/components/CloseDoorForm.svelte';
	import SettingsDoorForm from '$lib/components/SettingsDoorForm.svelte';


	let page: string | null = 'close';
	page = sessionStorage.getItem('page');
	page = page == null ? 'close' : page;

	$: sessionStorage.setItem('page', page == null ? 'close' : page);
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
				<CloseDoorForm />
			{:else if page == 'open'}
				<OpenDoorForm />
			{:else if page == 'door'}
				<SettingsDoorForm />
			{:else}
				<p>error</p>
			{/if}

			<!-- main end-->
		</div>
	</div>
</div>
<SnackBar  />
