import * as React from 'react';
import moment from 'moment';

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
        this.sys.on((info: ICalendarInfo) => this.setState({ info: this.filterEvents(info) }))

        setInterval(() => {
            this.setState({ info: this.filterEvents(this.state.info) })
        }, 10000);
    }

    render() {
        const info = this.state.info;
        return <div className='ui-module calendar'>
            {info.today && <CalendarDay
                events={info.today.slice(0, 6)}
            />}
        </div>;
    }

    private filterEvents(info: ICalendarInfo) : ICalendarInfo {
        info.today = info.today.filter(e => moment(e.start).add(5, 'm').isAfter(moment()));
        return info;
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
        return <div className='calendar-tile'>
            <div className={`calendar-tile-type calendar-${event.calendar.type}`}></div>
            <span>{`${event.start.format('HH:mm')} - ${event.end.format('HH:mm')}`}</span>
            <h3>{event.name}</h3>
        </div>;
    }
}