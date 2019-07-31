import * as si from 'systeminformation';

export interface CpuInfo {
    percent: number;
}

export class CpuModule {
    async get() : Promise<any> {
        return si.cpu();
    }
}