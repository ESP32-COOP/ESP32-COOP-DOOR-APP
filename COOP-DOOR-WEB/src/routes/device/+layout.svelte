<script lang="ts" >
	import Popup from "$lib/components/Popup.svelte";
	import { type BLEType, getDevice } from "$lib/script/BLE";
	import { onMount, onDestroy } from "svelte";
	import { BLE } from "../../stores";



      let localBLE: BLEType;
      let device:BluetoothDevice | undefined;
      let deviceConnected = true;

      const unsubscribe = BLE.subscribe((value) => localBLE = value)


    

      onMount(async() => {
            device  =  getDevice();
            if (device?.gatt?.connected){
                  device?.addEventListener('gattserverdisconnected', onDeviceDisconnect);
            }else{
                  onDeviceDisconnect(new Event('Failed to connect to device'))
            }
            console.log("device",device?.gatt?.connected)
            
            

            

      })

      function onDeviceDisconnect(event: Event) {
            const disconnectedDevice = event.target as BluetoothDevice;
            console.log('Device disconnected:', disconnectedDevice);
            deviceConnected = false;
            }

      onDestroy( async() => {
            device?.removeEventListener('gattserverdisconnected', onDeviceDisconnect);
      })
</script>



<slot></slot>

{#if !deviceConnected}
	<Popup message={'The device is disconnected ...'} redirect={'/'} />
{/if}