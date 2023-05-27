import { writable } from 'svelte/store'
import type { BLEType } from '$lib/script/BLE'
import type { LightDTO } from './types/lightDTO';
 

  
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
    doorCharUUID:"c3773399-b755-4e30-9160-bed203fae718".toLowerCase(),
    doorChar:undefined,
    doorCloseCharUUID:"e011ba0e-84c5-4e83-8648-f3e2660c44b0".toLowerCase(),
    doorCloseChar:undefined,
    doorOpenCharUUID:"cc959fff-4f84-4d08-a720-9d9156a48ed5".toLowerCase(),
    doorOpenChar:undefined,
});

export let light = writable<LightDTO>({
    value: 0, min: 0, max: 0
})

export let date = writable<Date>(new Date())