import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CpuModule, CpuInfo } from './modules/cpu';

interface IAppState {
    cpu: CpuInfo
}

class App extends React.Component<{}, IAppState> {
    cpu: CpuModule;

    state = {
        cpu: {} as CpuInfo
    }

    constructor(props) {
        super(props);

        this.cpu = new CpuModule();
    }

    async componentDidMount() {
        let blah = await this.cpu.get();
        console.log(blah);
    }

    render() {
        return <div>
            {this.state.cpu && this.state.cpu.percent}
        </div>;
    }
}

const container = document.querySelector('#container');
if (container)
    ReactDOM.render(<App />, container);