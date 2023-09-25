<script lang="ts">
	import { goto } from '$app/navigation';
	import { getDeviceInfo, getDeviceGatt, connectGATT } from '$lib/script/BLE';
	import SnackBar from '$lib/components/SnackBar.svelte';
	import { showToast } from '../stores';
	import { toggleDevMode as toggleDevMode } from '$lib/script/Dev';
	let connect_text = 'connect';


	async function connect() {
		connect_text = 'waiting';
		await getDeviceInfo();
		connect_text = 'connecting';
		try {
			await connectGATT((msg:string )=> {
				showToast({type:'success', message: msg , duration:2000});
			});
			
			if (await getDeviceGatt()) {
				goto('device');
			} else {
				connect_text = 'connect';
			}
		} catch (error) {
			console.error(error);
			showToast({type:'error', message: error as string});
			connect_text = 'connect';
		}

		
	}

	function handleKeyPress(event: any) {
    	if (event.key === 'D' || event.key === 'd') {
			const devMode: Boolean = toggleDevMode();
			if (devMode){
				goto('device')
				showToast({type:'success', message: "Dev mode enable" , duration:2000});
			}else{
				showToast({type:'info', message: "Dev mode disable" , duration:2000});
			}
    	}
  	}	


</script>

<div
	class="grid grid-cols-1 p-2 h-screen bg-opacity-20 bg-slate-600"
	style="grid-template-rows : 1fr 1fr 8fr 3fr;"
>
	<div class="flex flex-row items-center w-full h-full" />

	<h1 class="ml-8 text-3xl uppercase">connect <span class="font-bold">device</span></h1>
	<div class=" bg-[url('/connect.svg')] bg-center bg-no-repeat" />
	<div class="flex justify-center items-center w-full h-full">
		<!-- <button disabled type="button" class="inline-flex items-center px-5 py-2.5 mr-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
    
    Loading...
</button> -->

		<button
			disabled={connect_text != 'connect' ? true : false}
			on:click={connect}
			class="{connect_text != 'connect'
				? 'text-slate-400'
				: 'text-white'} flex h-20 w-fit items-center justify-center rounded-3xl bg-gradient-to-r from-slate-700 to-slate-900 px-3 text-5xl uppercase text-white"
		>
			{#if connect_text != 'connect'}
				<svg
					aria-hidden="true"
					role="status"
					class="inline mr-2 w-8 h-8 text-white animate-spin"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="#E5E7EB"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="rgb(2 132 199)"
					/>
				</svg>
			{/if}
			{connect_text}
		</button>
	</div>
</div>
<SnackBar  />

<svelte:window on:keydown={handleKeyPress} />