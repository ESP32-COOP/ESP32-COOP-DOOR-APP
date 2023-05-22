<script lang="ts" >
	import { onDestroy, onMount } from "svelte";

    let timeoutId: number;
    let mode:  "error"|"warning" | "success" | "info" ;
    let visible: boolean ;
    let message: string ;
    const colorMap = {
        error: "bg-red-500 text-white",
        warning: "bg-yellow-600 text-black",
        success: "bg-green-600 text-white",
        info: "bg-gray-600 text-white"
    }

    export function displayToast(_type: "error"|"warning" | "success" | "info", _message: string){
        mode = _type;
        message = _message;
        visible = true;
        console.debug("visible",visible)
        timeoutId = setTimeout(_ => {
            visible = false;
            console.debug("visible",visible)
        }, 4000)
    }

    onMount(() => {
        mode = "info";
        visible = false;
        message ="";
    })

    

    onDestroy( () => {
        clearTimeout(timeoutId)
	});

</script>
{#if visible}
    <div  class="fixed  bottom-0 w-full h-5 flex justify-center items-center 
    {colorMap[mode]}
    " >
<p class=" h-fit w-fit truncate text-xs">{message}</p>
</div>
{/if}

