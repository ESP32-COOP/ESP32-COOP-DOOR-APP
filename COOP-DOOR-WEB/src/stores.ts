import { writable } from 'svelte/store'
import type { BLEType } from '$lib/script/BLE'
 

  
export let BLE = writable<BLEType>( {
    device: undefined,
    GATT:undefined,
    deviceName: "COOP-DOOR",
    serviceUUID: "1ce76320-2d32-41af-b4c4-46836ea7a62a".toLowerCase(),
    service: undefined,
    dateCharUUID: "ad804469-19ec-406a-b949-31ae17e43813".toLowerCase(),
    dateChar: undefined,
    lightCharUUID:"947aad02-c25d-11ed-afa1-0242ac120002".toLowerCase(),
    lightChar:undefined,
});