import * as os from 'os-utils';
import BaseModule from '../base/sys';

export interface CpuInfo {
    usage: number;
    temperature: number;
}

export class CpuModule extends BaseModule<CpuInfo> {
    async get() : Promise<CpuInfo> {
        return new Promise<CpuInfo>(resolve => {
            os.cpuUsage(value => {
                resolve({
                    usage: value
                } as CpuInfo);
            })
        });
    }
}