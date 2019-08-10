import * as os from 'os-utils';
import * as si from 'systeminformation';
import BaseModule from '../base/sys';

export interface ICpuInfo {
    load: number;
    temperature: number;
}

export class CpuModule extends BaseModule<ICpuInfo> {
    protected async get() : Promise<ICpuInfo> {
        const [ load, temperature ] = await Promise.all([
            si.currentLoad(),
            si.cpuTemperature()
        ]);

        return {
            load: load.currentload,
            temperature: temperature.main
        };
    }
}