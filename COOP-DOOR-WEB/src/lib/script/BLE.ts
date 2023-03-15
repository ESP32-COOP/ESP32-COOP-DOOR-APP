import { BLE } from '../../stores';
import { onDestroy, onMount } from 'svelte';


let  localBLE : BLEType;

const unsubscribe = BLE.subscribe((value) => localBLE = value)

function updateBLE() {
    // Update the BLE store with the new value
    BLE.set(localBLE);
  }


export interface BLEType {
    device?: BluetoothDevice,
    GATT?:BluetoothRemoteGATTServer,
    deviceName: string,
    serviceUUID: BluetoothServiceUUID,
    service?: BluetoothRemoteGATTService,
    dateCharUUID: BluetoothCharacteristicUUID,
    dateChar?: BluetoothRemoteGATTCharacteristic,
    lightCharUUID:BluetoothCharacteristicUUID,
    lightChar?:BluetoothRemoteGATTCharacteristic,
}


export function iSWebBLEAvailable() {
    console.log("hello ")
    if (!navigator.bluetooth) {
        console.log('not available');
        return false;
    }
    return true;

}

export async function getDeviceInfo() {
    let options = {
        //acceptAllDevices: true,
        optionalServices: [localBLE.serviceUUID, localBLE.dateCharUUID,localBLE.lightCharUUID],
        filters: [
            { namePrefix: localBLE.deviceName }
        ]
    }

    console.log("Requestion BLE device info...")

    try {
        const device = await navigator.bluetooth.requestDevice(options);
        localBLE.device = device;
        console.log('name ' + device.name);
        updateBLE();
    } catch (error) {
        console.log('Request device error: ' + error);
    }
}


export async function connectGATT() {
    if (localBLE.device != undefined && localBLE.device.gatt != undefined ){
        console.log("device status",localBLE.device.gatt.connected)
        localBLE.GATT = await localBLE.device.gatt.connect()
    }
    if (localBLE.GATT != undefined){
        localBLE.service = await localBLE.GATT.getPrimaryService(localBLE.serviceUUID);
        localBLE.dateChar = await localBLE.service.getCharacteristic(localBLE.dateCharUUID);
        localBLE.lightChar = await localBLE.service.getCharacteristic(localBLE.lightCharUUID);
        updateBLE();
    }
    

}

export async function isDeviceConnected(){
    if (localBLE.device != undefined && localBLE.device.gatt != undefined) return await localBLE.device.gatt.connect()
    return false
}

export async function readLight(): Promise<number[]>{
    if (localBLE.lightChar){
        const divider = 1000 / 255 // 255 max value of bytes
        const dump = await localBLE.lightChar.readValue()
        const data = getArryFromBuffer(dump,3);
	    return [Math.ceil(data[0]*divider),Math.ceil(data[1]*divider),Math.ceil(data[2]*divider)]
    }
    return [-1,-1,-1]
}


export async function readDate() {
    if (localBLE.dateChar){
        const dump = await localBLE.dateChar.readValue()
        return getLongFromBytesBuffer(dump)
    }
    
}


export async function writeDate(){
    if (localBLE.dateChar){
        let now =  Math.round(Date.now() / 1000); //Date.now();
        let bytes: number[] = getBytesFromLong(now);
        console.log(now,bytes,getLongFromBytes(bytes))
        let buffer = new Uint8Array(bytes).buffer;
        await localBLE.dateChar.writeValue(buffer);
        return true

    }
    return false;
}


export function getBytesFromLong(x: number) : Array<number> {
  let bytes = new Array(8);
  for (let i = 0; i < 8; i++) {
    bytes[i] = x & 0xff;
    x = (x - bytes[i]) / 256;
  }
  return bytes;
}





export function getLongFromBytes(bytes: number[]) {
  let result = 0;
  for (let i = 7; i >= 0; i--) {
    result = (result * 256) + bytes[i];
  }
  return result;
}


export function getLongFromBytesBuffer(bytes: DataView) {
  let result = 0;
  for (let i = 7; i >= 0; i--) {
    result = (result * 256) + bytes.getUint8(i);
  }
  return result;
}
function getArryFromBuffer(bytes : DataView,len: number){
    let result = [];
    for (let i = 0; i < len; i++) {
        result.push( bytes.getUint8(i));
    }
    return result;
}