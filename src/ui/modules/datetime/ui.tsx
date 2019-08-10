import * as React from 'react';
import moment from 'moment';

import { DateTimeModule } from './sys';

import './style.scss';

export class DateTime extends React.Component<{}, { datetime: moment.Moment }> {
    sys: DateTimeModule;

    state = {
        datetime: moment()
    }

    constructor(props) {
        super(props);

        this.sys = new DateTimeModule();
    }

    componentDidMount() {
        this.sys.on((datetime: moment.Moment) => this.setState({ datetime }))
    }

    render() {
        const datetime = this.state.datetime;
        return <div className='ui-module datetime'>
            <span className='time'>{datetime.format('HH:mm')}</span>
            <br />
            <span className='date'>{datetime.format('dddd, MMMM Do')}</span>
        </div>;
    }
}