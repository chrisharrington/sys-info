import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';

import fs from 'fs';
import moment from 'moment';

import BaseModule from '../base/sys';

import tokens from './authorization.json';

const CALENDARS = [
    'chrisharrington99@gmail.com',
    'Swyfft'
];

export interface ICalendarInfo {
    today: CalendarEvent[];
    tomorrow: CalendarEvent[];
}

export class CalendarModule extends BaseModule<ICalendarInfo> {
    constructor() {
        super(15*60*1000);
    }
    
    protected async get() : Promise<ICalendarInfo> {
        const calendars = await this.getCalendars(),
            events = await Promise.all(calendars.map(this.getEventsForCalendar.bind(this))),
            unknown = events as unknown,
            array = unknown as CalendarEvent[][],
            flattened: CalendarEvent[] = ([] as CalendarEvent[]).concat(...array),
            sorted: CalendarEvent[] = flattened.sort((first: CalendarEvent, second: CalendarEvent) => {
                if (first.start.isBefore(second.start))
                    return -1;
                if (second.start.isBefore(first.start))
                    return 1;
                return 0;
            });

        return {
            today: sorted.filter(e => moment(e.start).startOf('d').isSame(moment().add(2, 'd').startOf('d'))),
            tomorrow: sorted.filter(e => moment(e.start).startOf('d').isSame(moment().add(3, 'd').startOf('d')))
        };
    }

    private async getCalendars() : Promise<Calendar[]> {
        return new Promise<Calendar[]>(resolve => {
            this.buildApi().calendarList.list((err, res) => {
                if (err)
                    console.log('The API returned an error: ' + err);
                else {
                    const calendars = (res as any).data.items
                        .filter(c => CALENDARS.indexOf(c.summary) > -1)
                        .map(c => new Calendar(c.id, c.summary));

                    resolve(calendars);
                }
            });
        });
    }

    private async getEventsForCalendar(calendar: Calendar) : Promise<CalendarEvent[]> {
        return new Promise<CalendarEvent[]>(resolve => {
            this.buildApi().events.list({
                calendarId: calendar.id,
                timeMin: (new Date()).toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime',
            }, (err, res) => {
                if (err)
                    console.log('The API returned an error: ' + err);
                else {
                    const events = (res as any).data.items
                        .map(e => {
                            const event = new CalendarEvent();
                            event.name = e.summary;
                            event.calendar = calendar;
                            event.start = moment(e.start.dateTime, 'YYYY-MM-DDTHH:mm:ssZ');
                            event.end = moment(e.end.dateTime, 'YYYY-MM-DDTHH:mm:ssZ');
                            return event;
                        });

                    resolve(events);
                }
            });
        });
    }

    private buildApi() : calendar_v3.Calendar {
        const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
            clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID,
            redirectUris = (process.env.GOOGLE_REDIRECT_URIS as string).split(','),
            client = new google.auth.OAuth2(clientId, clientSecret, redirectUris[0]);

        client.setCredentials(tokens);
        return google.calendar({ version: 'v3', auth: client });
    }
}

export class Calendar {
    id: string;
    type: CalendarType;
    name: string;
    events: CalendarEvent[];

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;

        switch (name) {
            case 'chrisharrington99@gmail.com':
                this.type = CalendarType.Personal;
                break;
            case 'Swyfft':
                this.type = CalendarType.Swyfft;
                break;
        }
    }
}

export class CalendarEvent {
    calendar: Calendar;
    name: string;
    start: moment.Moment;
    end: moment.Moment;
}

export enum CalendarType {
    Personal,
    Swyfft
}