import { devMode } from "../../stores";

let localDevMode: Boolean;

const unsubscribe = devMode.subscribe((value) => (localDevMode = value));

function updateDevMode() {
	devMode.set(localDevMode);
}


export function isInDevMode():Boolean{
    return localDevMode;
}


export function setDevMode(newMode:Boolean){
    localDevMode = newMode;
    updateDevMode();
}

export function toggleDevMode(): Boolean{
    const newDevMode = !localDevMode;
    setDevMode(newDevMode);
    return newDevMode;
}