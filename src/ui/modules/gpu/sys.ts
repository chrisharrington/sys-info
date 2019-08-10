import BaseModule from '../base/sys';
import { exec } from 'child_process';

export interface IGpuInfo {
    temperature: number;
}

export class GpuModule extends BaseModule<IGpuInfo> {
    protected async get() : Promise<IGpuInfo> {
        return new Promise(resolve => {
            exec('nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader', (_, value: string) => {
                resolve({
                    temperature: parseInt(value)
                });
            });
        });
    }
}