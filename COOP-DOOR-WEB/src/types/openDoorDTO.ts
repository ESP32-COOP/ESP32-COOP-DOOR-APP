export interface DoorCondidtionDTO{
    lightOption: boolean,
    timeOption: boolean,
    condition: 'AND' | 'OR',
    lightThreshold: number,
    timeThreshold: Timestamp
}

export interface Timestamp {
    hour: number;
    minute: number;
}  