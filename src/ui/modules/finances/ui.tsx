import * as React from 'react';

import { FinancesModules, IFinancesInfo } from './sys';

import './style.scss';

export class Finances extends React.Component<{}, { info: IFinancesInfo }> {
    sys: FinancesModules;

    state = {
        info: {} as IFinancesInfo
    }

    constructor(props) {
        super(props);

        this.sys = new FinancesModules();
    }

    componentDidMount() {
        this.sys.on((info: IFinancesInfo) => this.setState({ info }))
    }

    render() {
        return <div className='ui-module finances'></div>;
    }
}