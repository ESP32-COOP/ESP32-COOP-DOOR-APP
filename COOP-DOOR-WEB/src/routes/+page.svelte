<script lang="ts">
	import { goto } from "$app/navigation";
    import { BLE } from '../stores.js';
    import { onDestroy, onMount } from 'svelte';

    let localBLE;

    const unsubscribe = BLE.subscribe((value) => localBLE = value)

    onDestroy(unsubscribe)


    function iSWebBLEAvailable() {
		if (!navigator.bluetooth){
		console.log('not available');
		return false;
		}
		return true;
		
	}

	function getDeviceInfo() {
		let options = {
			//acceptAllDevices: true,
			optionalServices : [localBLE.service, localBLE.dateChar ],
			filters : [
			{namePrefix: BLE.deviceName}
			]
		}

		console.log("Requestion BLE device info...")

		return navigator.bluetooth.requestDevice(options).then(device => {
			localBLE.device = device;
			console.log('name '+device.name);
		}).catch(error => {
			console.log('Request device error: '+error);
		})
	}

    onMount(async () => {
        console.log(iSWebBLEAvailable())
        if (iSWebBLEAvailable()){
            getDeviceInfo(); 
        }
		
	});

    

    // async function connectGATT2(){
    //     deviceConnected = await bluetoothDeviceDetected.gatt.connected;
    //     server = await bluetoothDeviceDetected.gatt.connect()

    //     progressBar.newValue = 100;
    //     move();


    //     service2 = await server.getPrimaryService(dateService);

    //     GATT_date = await service2.getCharacteristic(dateChar);

    //     GATT_LED.addEventListener('characteristicvaluechanged',
    //             handleChangedValue);
    //     GATT_RadNb.addEventListener('characteristicvaluechanged',
    //             handleChangedValue);
    //     document.querySelector('#start').disabled = false;
    //         document.querySelector('#stop').disabled = false;
    //         document.querySelector('#led').disabled = false;
    // }

	


    function connect() {
        //if (iSWebBLEAvailable()){
            getDeviceInfo(); 
        //}
        goto("device");
    }
    </script>

<div class="p-2 h-screen grid grid-cols-1 bg-opacity-20 bg-slate-600   " style="grid-template-rows : 1fr 1fr 8fr 3fr;">
    <div class="w-full h-full flex flex-row items-center ">
        
    </div>

    <h1 class=" uppercase text-3xl ml-8">connect <span class="font-bold">device</span></h1>
    <div class=" bg-[url('/connect.svg')] bg-no-repeat bg-center">

    </div>
    <div class="h-full w-full flex justify-center items-center">
        <button on:click={ connect} class="bg-gradient-to-r from-slate-700 to-slate-900 rounded-3xl w-72 flex justify-center items-center h-20 text-white text-5xl uppercase">
            connect
        </button>


    </div>


</div>

