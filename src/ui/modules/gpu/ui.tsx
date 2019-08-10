import * as React from 'react';
import numeral from 'numeral';

import { RadialChart } from '../../components/radial-chart';

import { GpuModule, IGpuInfo } from './sys';

import './style.scss';

export class GpuTemperature extends React.Component<{}, { temperature: number }> {
    sys: GpuModule;

    state = {
        temperature: 0
    }

    constructor(props) {
        super(props);

        this.sys = new GpuModule();
    }

    componentDidMount() {
        this.sys.on((info: IGpuInfo) => this.setState({ temperature: info.temperature }))
    }

    render() {
        return <div className='ui-module gpu-temperature'>
            <RadialChart
                label='GPU°'
                value={this.state.temperature}
                format={(value: number) => `${value}°`}
            />
        </div>;
    }
}