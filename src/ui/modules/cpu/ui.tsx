import * as React from 'react';
import numeral from 'numeral';

import { RadialChart } from '../../components/radial-chart';

import { CpuModule, ICpuInfo } from './sys';

import './style.scss';

export class CpuLoad extends React.Component<{}, { load: number }> {
    sys: CpuModule;

    state = {
        load: 0
    }

    constructor(props) {
        super(props);

        this.sys = new CpuModule();
    }

    componentDidMount() {
        this.sys.on((info: ICpuInfo) => this.setState({ load: info.load }))
    }

    render() {
        return <div className='ui-module cpu-load'>
            <RadialChart
                label='CPU'
                value={this.state.load}
                format={(value: number) => numeral(value).format('00.00') + '%'}
            />
        </div>;
    }
}

export class CpuTemperature extends React.Component<{}, { temperature: number }> {
    sys: CpuModule;

    state = {
        temperature: 0
    }

    constructor(props) {
        super(props);

        this.sys = new CpuModule();
    }

    componentDidMount() {
        this.sys.on((info: ICpuInfo) => this.setState({ temperature: info.temperature }))
    }

    render() {
        return <div className='ui-module cpu-temperature'>
            <RadialChart
                label='CPU°'
                value={this.state.temperature}
                format={(value: number) => numeral(value).format('00.00') + '%'}
            />
        </div>;
    }
}