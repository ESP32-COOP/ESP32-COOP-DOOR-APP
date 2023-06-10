<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Toast } from '../../types/Toast';
	import { toastQueue } from '../../stores';

	let localToastQueue: Toast[];

	const unsubscribe = toastQueue.subscribe((value) => (localToastQueue = value));

	let currentToast: Toast;

	let timeout: NodeJS.Timeout;
	let visible: boolean;
	const colorMap = {
		error: 'bg-red-500 text-white',
		warning: 'bg-yellow-600 text-black',
		success: 'bg-green-600 text-white',
		info: 'bg-gray-600 text-white'
	};

	function displayToast() {
		if (localToastQueue.length >= 1) {
			currentToast = localToastQueue[0];
			visible = true;
			timeout = setTimeout(
				() => {
					visible = false;
					localToastQueue.shift();
					toastQueue.set(localToastQueue);
				},
				currentToast.duration ? currentToast.duration : 4000
			);
		}
	}

    $:localToastQueue, displayToast();

	onMount(() => {
		visible = false;
	});

	onDestroy(() => {
		clearTimeout(timeout);
	});
</script>

{#if visible}
	<div
		class="fixed  bottom-0 flex h-5 w-full items-center justify-center 
    {colorMap[currentToast.type]}
    "
	>
		<p class=" h-fit w-fit truncate text-xs">{currentToast.message}</p>
	</div>
{/if}
