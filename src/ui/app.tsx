import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Cpu from './modules/cpu/ui';

class App extends React.Component {
    render() {
        return <div>
            <Cpu />
        </div>;
    }
}

const container = document.querySelector('#container');
if (container)
    ReactDOM.render(<App />, container);