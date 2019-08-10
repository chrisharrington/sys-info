import moment from 'moment';

import BaseModule from '../base/sys';

export class DateTimeModule extends BaseModule<moment.Moment> {
    protected async get() : Promise<moment.Moment> {
        return Promise.resolve(moment());
    }
}