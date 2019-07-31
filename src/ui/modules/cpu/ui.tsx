import * as React from 'react';

import { CpuModule, CpuInfo } from './sys';
import { RadialChart } from '../base/ui';

interface ICpuState {
    info: CpuInfo;
}

export default class Cpu extends React.Component<{}, ICpuState> {
    sys: CpuModule;

    state = {
        info: {
            usage: 0,
            temperature: 0
        }
    }

    constructor(props) {
        super(props);

        this.sys = new CpuModule();
    }

    componentDidMount() {
        this.sys.on((info: CpuInfo) => this.setState({ info }))
    }

    render() {
        return <div className='ui-module cpu'>
            <RadialChart
                label='CPU'
                value={this.state.info.usage*500}
            />
        </div>;
    }
}

