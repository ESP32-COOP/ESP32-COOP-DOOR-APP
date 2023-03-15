<script lang="ts">
	import { getArryFromBuffer, localBLE } from "$lib/script/BLE";
	import { onDestroy, onMount } from "svelte";
    const divider = 1000 / 255 // 255 max value of bytes
    let lightValue = 40;
    let minValue = 30;
    let maxValue = 60;



    onMount(async () => {
        if (localBLE.device && localBLE.GATT && localBLE.lightChar) {
            localBLE.lightChar.addEventListener('characteristicvaluechanged', handleChangedValue);
            localBLE.lightChar?.startNotifications();
        }
		 
	});

	onDestroy(async () => {
		if (localBLE.lightChar) {
            localBLE.lightChar.removeEventListener('characteristicvaluechanged', handleChangedValue);
            await localBLE.lightChar.stopNotifications();
        }
	});

    function handleChangedValue(ev: Event) {
        const characteristic = ev.target as BluetoothRemoteGATTCharacteristic;
        const value = characteristic.value as DataView;
        const data = getArryFromBuffer(value, 3)
        lightValue = Math.ceil(data[0]*divider);
        minValue = Math.ceil(data[1]*divider);
        maxValue = Math.ceil(data[2]*divider);
    }

</script>

<h1 class="uppercase text-3xl ml-8">light <span class="font-bold">sensor</span></h1>
<div class="w-full h-full flex items-center justify-center">
    <div class="rounded-2xl bg-gradient-to-r  from-blue-900 to-slate-900 opacity-70 w-4/5 h-[60%]">
        <div class="grid w-full h-full gap-5 p-5" style="grid-template-rows : 2fr 8fr 2fr ">
            <div class="w-full h-full flex items-center justify-center">
                <div class="rounded-2xl bg-slate-200/20   w-full h-full
                 flex items-center ">
                    <div style="width: {lightValue/maxValue*100}%;" class=" rounded-xl  bg-gradient-to-r from-red-400 to-yellow-200  h-full  transition-all">
                    </div>
                </div>
            </div>
            <div class="grid w-full h-full columns-1 gap-5">
                <div class="w-full h-full flex items-center justify-center">
                    <div class="rounded-2xl bg-slate-200/20  w-full h-full grid grid-cols-2 items-center justify-center gap-3">
                        <p class="text-white/60 text-xl text-right">value : </p><h2 class="text-white text-5xl">{lightValue}</h2>
                    </div>
                </div>
                <div class="w-auto h-full columns-2  gap-5">
                    <div class="rounded-2xl bg-slate-200/20  w-full h-full flex flex-col justify-center items-center">
                        <h3 class="text-white text-4xl">{minValue}</h3>
                        <p class="text-white/60">min</p>
                        
                    </div>
                    <div class="rounded-2xl bg-slate-200/20  w-full h-full flex flex-col justify-center items-center">
                        <h3 class="text-white text-4xl">{maxValue}</h3>
                        <p class="text-white/60">max</p>
                    </div>

                </div>


            </div>
            <div class="flex items-center justify-center w-full h-full">
                <button class="uppercase bg-slate-500/50 rounded-xl  w-full h-full text-white text-2xl " >reset</button>
            </div>
        </div>

        

    </div>
</div>