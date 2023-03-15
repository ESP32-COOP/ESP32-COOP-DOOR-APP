<script lang="ts">
	import { goto } from '$app/navigation';
    import SmallBadge from '$lib/components/SmallBadge.svelte';
	import { isDeviceConnected, readDate, readLight } from '$lib/script/BLE';
	import { error } from '@sveltejs/kit';
	import { onDestroy, onMount } from 'svelte';

    let deviceValue = 1;
    let deviceDate = new Date();
    const options :Intl.DateTimeFormatOptions = { timeZone: 'Europe/Paris', hour12: false, hour: '2-digit', minute: '2-digit' };
    let timeoutIdDate: NodeJS.Timeout | null  = null;
    let timeoutIdLight: NodeJS.Timeout | null  = null;


    const lightSmallBadgeData = {
        title: 'Light Sensor',
        subTitle: 'britness level',
        subTitleType: "value",
        value: deviceValue,
        badgeType: "dark",
        link: "cards/light"

    }

    const dateSmallBadgeData = {
        title: 'Date Time',
        subTitle: 'britness level',
        subTitleType: "value",
        icon: "clock",
        link: "cards/clock"

    }




onMount(async () => {
        await updateDate();
        await updateLight();
   
	});

onDestroy(() => {
  // If a timeout is still active, clear it when the component is destroyed
  if (timeoutIdDate !== null) {
    clearTimeout(timeoutIdDate);
  }
});

async function updateLight(){
    if (!isDeviceConnected()){
        goto("/")
    }
    readLight()
    .then(value => {
        deviceValue=  value[0];
        console.log("reading lght from device page ...",deviceValue)
    }).catch(error => {
        console.log("Light not Updated..",error)
    })
    .finally(() =>{
        timeoutIdLight = setTimeout(() => updateLight(), 2000);
    })
        

    

}

async function updateDate(){
    if (!isDeviceConnected()){
        goto("/")
    }
    let value  = await readDate();
    if (value){
        deviceDate=  new Date(value*1000);

        console.log("reading date device page...", value, new Date(value*1000).toLocaleTimeString('en-US', options));
        
    } 
    timeoutIdDate = setTimeout(() => updateDate(), 10000);

}
</script>

<div class="p-2 h-screen grid grid-cols-1 " style="grid-template-rows : 1fr 1fr 8fr 3fr;">
    <div class="w-full h-full flex flex-row items-center">
        <a class="ml-auto" href="settings">
            <div class=" ml-auto bg-opacity-80 bg-slate-300 h-fit m-2 p-2 rounded-full">
                <img src="gear.svg" alt="gear">
            </div>
        </a>
    </div>

    <h1 class="uppercase text-3xl ml-8">coop <span class="font-bold">door</span></h1>
    <div class="bg-[url('/coop.svg')] bg-no-repeat bg-center">

    </div>
    <div class="h-full mx-4    grid grid-cols-2 gap-4 w-auto">

        <SmallBadge { ...lightSmallBadgeData} value={deviceValue} />
        <SmallBadge { ...dateSmallBadgeData} value={deviceDate} />
        
    </div>

</div>

