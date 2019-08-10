import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CpuLoad, CpuTemperature } from './modules/cpu/ui';
import { GpuTemperature } from './modules/gpu/ui';
import { Memory } from './modules/memory/ui';
import { DateTime } from './modules/datetime/ui';
import { Weather } from './modules/weather/ui';

import './style.scss';

class App extends React.Component {
    render() {
        return <div>
            <CpuLoad />
            <CpuTemperature />
            <GpuTemperature />
            <Memory />
            <DateTime />
            <Weather />
        </div>;
    }
}

const container = document.querySelector('#container');
if (container)
    ReactDOM.render(<App />, container);