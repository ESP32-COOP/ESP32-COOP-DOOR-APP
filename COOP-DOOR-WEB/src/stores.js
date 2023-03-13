import { writable } from 'svelte/store'
 
export let BLE = writable({"device":null,"deviceName": 'COOP-DOOR',
            "service":null,"dateChar":null});