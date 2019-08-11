import * as React from 'react';

import { CalendarModule, ICalendarInfo, CalendarEvent } from './sys';

import './style.scss';

export class Calendar extends React.Component<{}, { info: ICalendarInfo }> {
    sys: CalendarModule;

    state = {
        info: {} as ICalendarInfo
    }

    constructor(props) {
        super(props);

        this.sys = new CalendarModule();
    }

    componentDidMount() {
        this.sys.on((info: ICalendarInfo) => this.setState({ info }))
    }

    render() {
        const info = this.state.info;
        return <div className='ui-module calendar'>
            {info.today && <CalendarDay
                events={info.today.slice(0, 3)}
            />}
            <div className='separator'></div>
            {info.tomorrow && <CalendarDay
                events={info.tomorrow.slice(0, 3)}
            />}
        </div>;
    }
}

class CalendarDay extends React.Component<{ events: CalendarEvent[] }> {
    render() {
        return <div className='calendar-day'>
            <div className='calendar-tile-wrapper'>
                {this.props.events.map((event: CalendarEvent, i: number) => <CalendarTile event={event} key={i} />)}
                <div className='clearfix'></div>
            </div>
        </div>;
    }
}

class CalendarTile extends React.Component<{ event: CalendarEvent }> {
    render() {
        const event = this.props.event;
        return <div className={`calendar-tile calendar-${event.calendar.type}`}>
            <h3>{event.name}</h3>
            <span>{`${event.start.format('HH:mm')} - ${event.end.format('HH:mm')}`}</span>
        </div>;
    }
}