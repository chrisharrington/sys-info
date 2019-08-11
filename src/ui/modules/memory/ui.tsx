import * as React from 'react';
import prettyBytes from 'pretty-bytes';

import { RadialChart } from '../../components/radial-chart';

import { MemoryModule, IMemoryInfo } from './sys';

import './style.scss';

export class Memory extends React.Component<{}, { info: IMemoryInfo }> {
    sys: MemoryModule;

    state = {
        info: {} as IMemoryInfo
    }

    constructor(props) {
        super(props);

        this.sys = new MemoryModule();
    }

    componentDidMount() {
        this.sys.on((info: IMemoryInfo) => this.setState({ info }))
    }

    render() {
        const free = this.state.info.free,
            total = this.state.info.total;

        return <div className='ui-module memory'>
            <RadialChart
                label='RAM'
                value={(total - free) / total * 100}
                format={() => isNaN(free) ? '-' : `${prettyBytes(total - free)}`}
            />
        </div>;
    }
}