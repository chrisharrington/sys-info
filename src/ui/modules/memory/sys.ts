import * as si from 'systeminformation';

import BaseModule from '../base/sys';

export interface IMemoryInfo {
    free: number;
    total: number;
}

export class MemoryModule extends BaseModule<IMemoryInfo> {
    async get() : Promise<IMemoryInfo> {
        const data = await si.mem();
        return {
            free: data.free,
            total: data.total
        };
    }
}