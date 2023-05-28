import { BLE } from '../../stores';
import { onDestroy, onMount } from 'svelte';
import type { DoorConditionDTO } from '../../types/doorCondition';


export let localBLE: BLEType;

const unsubscribe = BLE.subscribe((value) => localBLE = value)

function updateBLE() {
    // Update the BLE store with the new value
    BLE.set(localBLE);
}


export interface BLEType {
    device?: BluetoothDevice,
    GATT?: BluetoothRemoteGATTServer,
    deviceName: string,
    serviceUUID: BluetoothServiceUUID,
    service?: BluetoothRemoteGATTService,
    dateCharUUID: BluetoothCharacteristicUUID,
    dateChar?: BluetoothRemoteGATTCharacteristic,
    lightCharUUID: BluetoothCharacteristicUUID,
    lightChar?: BluetoothRemoteGATTCharacteristic,
    doorCharUUID: BluetoothCharacteristicUUID,
    doorChar?: BluetoothRemoteGATTCharacteristic,
    doorCloseCharUUID: BluetoothCharacteristicUUID,
    doorCloseChar?: BluetoothRemoteGATTCharacteristic,
    doorOpenCharUUID: BluetoothCharacteristicUUID,
    doorOpenChar?: BluetoothRemoteGATTCharacteristic,
}


export function iSWebBLEAvailable() {
    if (!navigator.bluetooth) {
        console.log('not available');
        return false;
    }
    return true;

}

export async function getDeviceInfo() {
    let options = {
        //acceptAllDevices: true,
        optionalServices: [localBLE.serviceUUID, localBLE.dateCharUUID, localBLE.lightCharUUID,
        localBLE.doorCharUUID, localBLE.doorCloseCharUUID, localBLE.doorOpenCharUUID],
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


export async function connectGATT(callback: Function = (msg: string) => { }) {
    if (localBLE.device != undefined && localBLE.device.gatt != undefined) {
        console.log("device status", localBLE.device.gatt.connected)
        localBLE.GATT = await localBLE.device.gatt.connect()
    }
    if (localBLE.GATT != undefined) {
        console.log("getting service...")
        callback("Connection successful, Getting service...")
        localBLE.service = await localBLE.GATT.getPrimaryService(localBLE.serviceUUID);
        console.log("getting Date char...")
        localBLE.dateChar = await localBLE.service.getCharacteristic(localBLE.dateCharUUID);
        console.log("getting Light char...")
        localBLE.lightChar = await localBLE.service.getCharacteristic(localBLE.lightCharUUID);
        console.log("getting Door char...")
        localBLE.doorChar = await localBLE.service.getCharacteristic(localBLE.doorCharUUID);
        console.log("getting Door Close char...")
        localBLE.doorCloseChar = await localBLE.service.getCharacteristic(localBLE.doorCloseCharUUID);
        console.log("getting Door Open char...")
        localBLE.doorOpenChar = await localBLE.service.getCharacteristic(localBLE.doorOpenCharUUID);
        updateBLE();
    }


}

export function isDeviceConnected() {
    return localBLE.device != undefined && localBLE.device.gatt != undefined && localBLE.device.gatt.connected
}

export async function getDevice() {
    if (localBLE.device != undefined && localBLE.device.gatt != undefined) return await localBLE.device.gatt.connect()
    return false
}

export async function readLight(): Promise<number[]> {
    if (localBLE.lightChar) {
        const divider = 1000 / 255 // 255 max value of bytes
        const dump = await localBLE.lightChar.readValue()
        const data = getArryFromBuffer(dump, 3);
        return [Math.ceil(data[0] * divider), Math.ceil(data[1] * divider), Math.ceil(data[2] * divider)]
    }
    return [-1, -1, -1]
}


export async function readDate() {
    if (localBLE.dateChar) {
        const dump = await localBLE.dateChar.readValue()
        return getLongFromBytesBuffer(dump)
    }

}


export async function writeDate() {
    if (localBLE.dateChar) {
        let now = Math.round(Date.now() / 1000); //Date.now();
        let bytes: number[] = getBytesFromLong(now);
        console.log(now, bytes, getLongFromBytes(bytes))
        let buffer = new Uint8Array(bytes).buffer;
        console.debug("buffer", buffer)
        await localBLE.dateChar.writeValue(buffer);
        return true

    }
    return false;
}


export function getBytesFromLong(x: number): Array<number> {
    let bytes = new Array(8);
    for (let i = 0; i < 8; i++) {
        bytes[i] = x & 0xff;
        x = (x - bytes[i]) / 256;
    }
    return bytes;
}

export function writeDoor(turn: number, status: 0 | 1 | 2 | 3) {
    if (localBLE.doorChar) {
        let buffer = new Uint8Array([turn * 10, status]).buffer;

        return localBLE.doorChar.writeValue(buffer)
            .catch(error => {
                throw error;
            })
    }
}

export async function readDoor(): Promise<number[]> {
    if (localBLE.doorChar) {
        const dump = await localBLE.doorChar.readValue();
        let data = getArryFromBuffer(dump, 2)
        data[0] = data[0] / 10;
        return data
    }
    return [1, 0]
}

export async function resetLight() {
    if (localBLE.lightChar) {
        let buffer = new Uint8Array([0, 0, 0, 1]).buffer;
        await localBLE.lightChar.writeValue(buffer);
    }
}


export function writeCloseDoor(mode: number, light: number, hour: number, minute: number) {
    if (localBLE.doorCloseChar) {
        console.debug("writeCloseDoor", [mode, light, hour, minute])
        let buffer = new Uint8Array([mode, light, hour, minute]).buffer;
        localBLE.doorCloseChar.writeValue(buffer);
    }
}

export function writeOpenDoor(mode: number, light: number, hour: number, minute: number) {
    if (localBLE.doorOpenChar) {
        let buffer = new Uint8Array([mode, light, hour, minute]).buffer;
        localBLE.doorOpenChar.writeValue(buffer);
    }
}

export async function readCloseDoor(): Promise<DoorConditionDTO> {
    if (localBLE.doorCloseChar) {
        let res: DoorConditionDTO;
        const values = getArryFromBuffer(await localBLE.doorCloseChar.readValue(), 4);
        console.debug("readCloseDoor", values)
        res = {
            condition: values[0] === 4 ? 'OR' : 'AND',
            lightOption: values[0] === 1 || values[0] >= 3 ? true : false,
            lightThreshold: values[1],
            timeOption: values[0] >= 2 ? true : false,
            timeThreshold: { hour: values[2], minute: values[3] }
        }
        return res
    }
    return {
        condition: 'OR',
        lightOption: false,
        lightThreshold: 0,
        timeOption: false,
        timeThreshold: { hour: 0, minute: 0 }
    }


}

export async function readOpenDoor(): Promise<DoorConditionDTO> {
    if (localBLE.doorOpenChar) {
        let res: DoorConditionDTO;
        const values = getArryFromBuffer(await localBLE.doorOpenChar.readValue(), 4);
        console.debug("readOpenDoor", values)
        res = {
            condition: values[0] === 4 ? 'OR' : 'AND',
            lightOption: values[0] === 1 || values[0] >= 3 ? true : false,
            lightThreshold: values[1],
            timeOption: values[0] >= 2 ? true : false,
            timeThreshold: { hour: values[2], minute: values[3] }
        }
        return res
    }
    return {
        condition: 'OR',
        lightOption: false,
        lightThreshold: 0,
        timeOption: false,
        timeThreshold: { hour: 0, minute: 0 }
    }
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
export function getArryFromBuffer(bytes: DataView, len: number) {
    let result = [];
    for (let i = 0; i < len; i++) {
        result.push(bytes.getUint8(i));
    }
    return result;
}

