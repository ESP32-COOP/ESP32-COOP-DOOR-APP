import { BLE } from '../../stores';
import { onDestroy, onMount } from 'svelte';


let  localBLE : BLEType;

const unsubscribe = BLE.subscribe((value) => localBLE = value)


export interface BLEType {
    device: BluetoothDevice;
    GATT:BluetoothRemoteGATTServer,
    deviceName: string;
    serviceUUID: BluetoothServiceUUID,
    service: BluetoothRemoteGATTService,
    dateCharUUID: BluetoothCharacteristicUUID,
    dateChar: BluetoothRemoteGATTCharacteristic,
}


export function iSWebBLEAvailable() {
    console.log("hello ")
    if (!navigator.bluetooth) {
        console.log('not available');
        return false;
    }
    return true;

}

export function getDeviceInfo() {
    let options = {
        //acceptAllDevices: true,
        optionalServices: [localBLE.serviceUUID, localBLE.dateCharUUID],
        filters: [
            { namePrefix: localBLE.deviceName }
        ]
    }

    console.log("Requestion BLE device info...")

    return navigator.bluetooth.requestDevice(options).then(device => {
        localBLE.device = device;
        console.log('name ' + device.name);
    }).catch(error => {
        console.log('Request device error: ' + error);
    })
}


export async function connectGATT2() {
    if (localBLE.device.gatt != undefined ){
        console.log("device status",localBLE.device.gatt.connected)
        localBLE.GATT = await localBLE.device.gatt.connect()
    }
    

    localBLE.service = await localBLE.GATT.getPrimaryService(localBLE.serviceUUID);

    localBLE.dateChar = await localBLE.service.getCharacteristic(localBLE.dateCharUUID);



}
