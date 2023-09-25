<script lang="ts">
	import { writeClosePosition } from "$lib/script/BLE";
	import { showToast } from "../../stores";

	let unsaved: boolean = false;


	function handleSetClosePosition() {
		writeClosePosition()
			.then((_) => {
				showToast({ type: 'success', message: 'Success: Values sent', duration: 2000 });
				unsaved = false;
			})
			.catch((error) => {
				console.log('failed', error);
				showToast({ type: 'error', message: error });
			});
	}
</script>

<div class="grid h-full w-full  gap-5 " >
		<button on:click={handleSetClosePosition} class="rounded-xl bg-slate-50 font-bold uppercase w-1/2 h-1/5 p-2">Set closed position </button>
		
</div>
