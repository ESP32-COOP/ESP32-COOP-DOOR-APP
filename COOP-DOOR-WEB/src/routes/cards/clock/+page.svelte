<script lang="ts">
	import { goto } from '$app/navigation';
    import {readDate, writeDate,isDeviceConnected} from '$lib/script/BLE'
    import { onDestroy, onMount } from 'svelte';


let datePhone = new Date();
let dateDevice = new Date(datePhone.getTime() + 2*60000);
const options :Intl.DateTimeFormatOptions = { timeZone: 'Europe/Paris', hour12: false, hour: '2-digit', minute: '2-digit' };
let stopRefresh = false;
let timeoutId: NodeJS.Timeout | null  = null;


onMount(async () => {
        await updateDate();
   
	});


onDestroy(() => {
  // If a timeout is still active, clear it when the component is destroyed
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
  }
});


async function updateDate(){
    if (!isDeviceConnected()){
        goto("/")
    }
    let value  = await readDate();
    if (value){
        dateDevice = new Date(value*1000);
        datePhone = new Date();
        console.log("reading date clock page...", value, new Date(value*1000).toLocaleTimeString('en-US', options));
        if (!stopRefresh) timeoutId = setTimeout(() => updateDate(), 5000);
    } 

}



function sync(){
    stopRefresh = true;
    console.log("syncing...")
    writeDate() 
    .then((res) => {
        console.log("updated!",res);
        stopRefresh = false;
    })
    .catch((error) => {
        console.log("failed",error)
    })
    .finally(()  =>{
        setTimeout(() => updateDate(),1000)
    })

    
}


</script>

<h1 class="uppercase text-3xl ml-8">date <span class="font-bold">time</span></h1>
<div class="w-full h-full flex items-center justify-center">
    <div class="rounded-2xl bg-slate-300 opacity-70 w-4/5 h-[60%] grid grid-cols-1 p-5 gap-5" style="grid-template-rows : 5fr 2fr 2fr ">
        <div class=" h-full w-full rounded-xl grid grid-cols-2 gap-5" >
            <div class="h-full w-full bg-slate-50 rounded-xl flex flex-col justify-around items-center">
                <h2 class="text-5xl">{dateDevice.toLocaleTimeString('en-US', options)}</h2>


                <h3 class="text-2xl">{dateDevice.getDay()}/{dateDevice.getMonth()}/{dateDevice.getFullYear()}</h3>
                <p class="text-black/80">device</p>
            </div>

            <div class="h-full w-full bg-slate-50 rounded-xl flex flex-col justify-around items-center">
                <h2 class="text-5xl">{datePhone.toLocaleTimeString('en-US', options)}</h2>
                <h3 class="text-2xl">{datePhone.getDay()}/{datePhone.getMonth()}/{datePhone.getFullYear()}</h3>
                <p class="text-black/80">phone</p>
            </div>

        </div> 

        <div class="bg-slate-50 rounded-xl grid grid-cols-2 items-center justify-center gap-5 " style="grid-template-columns : 2fr 8fr ;">
            <p class="ml-2  w-fit">delta :</p>
            <h4 class="text-red-500 text-3xl">{((dateDevice.getTime() - datePhone.getTime())/60000).toFixed(3)} min</h4>

        </div>

        <button on:click={ sync} class="bg-slate-50 rounded-xl uppercase text-xl font-semibold">
            sync device
        </button>


    </div>
</div>