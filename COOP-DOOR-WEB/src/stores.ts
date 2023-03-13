import { writable } from 'svelte/store'
import type { BLEType } from '$lib/script/BLE'
 

  
export let BLE = writable<BLEType>();