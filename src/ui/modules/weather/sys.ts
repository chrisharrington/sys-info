import weather from 'openweather-apis';
import request from 'request';

import Config from '../../config';

import BaseModule from '../base/sys';

export interface IWeatherInfo {
    current: WeatherDay;
    forecast: WeatherDay[]
}

export class WeatherModule extends BaseModule<IWeatherInfo> {
    constructor() {
        super(60*60*1000);
    }

    protected async get() : Promise<IWeatherInfo> {
        return new Promise<IWeatherInfo>(resolve => {
            request(Config.WeatherApiUrl, function (error, response, body) {
                let parsed = JSON.parse(body),
                    current = parsed.currently;

                resolve({
                    current: {
                        temperature: current.temperature,
                        type: WeatherType.getFromRemote(current.icon)
                    },
                    forecast: parsed.daily.data.slice(1, 4).map(weather => ({
                        temperature: weather.temperatureHigh,
                        type: WeatherType.getFromRemote(weather.icon)
                    }))
                });
            });
        });
    }
}

export class WeatherDay {
    temperature: number;
    type: WeatherSubType;
}

export class WeatherSubType {
    remote: string;
    icon: string;

    constructor(remote: string, icon: string) {
        this.remote = remote;
        this.icon = icon;
    }
}

export class WeatherType {
    static ClearDay: WeatherSubType = new WeatherSubType('clear-day', 'wi-day-sunny');
    static ClearNight: WeatherSubType = new WeatherSubType('clear-night', 'wi-night-clear');
    static Rain: WeatherSubType = new WeatherSubType('rain', 'wi-rain');
    static Snow: WeatherSubType = new WeatherSubType('snow', 'wi-snow');
    static Sleet: WeatherSubType = new WeatherSubType('sleet', 'wi-sleet');
    static Wind: WeatherSubType = new WeatherSubType('wind', 'wi-windy');
    static Fog: WeatherSubType = new WeatherSubType('fog', 'wi-fog');
    static Cloudy: WeatherSubType = new WeatherSubType('cloudy', 'wi-cloud');
    static PartlyCloudyDay: WeatherSubType = new WeatherSubType('partly-cloudy-day', 'wi-day-cloudy');
    static PartlyCloudyNight: WeatherSubType = new WeatherSubType('partly-cloudy-night', 'wi-night-alt-cloudy');
    static Hail: WeatherSubType = new WeatherSubType('hail', 'wi-hail');
    static Thunderstorm: WeatherSubType = new WeatherSubType('thunderstorm', 'wi-thunderstorm');
    static Tornado: WeatherSubType = new WeatherSubType('tornado', 'wi-tornado');

    static getFromRemote(value: string) : WeatherSubType {
        for (var name in WeatherType)
            if (WeatherType[name].remote === value)
                return WeatherType[name];
        return WeatherType.Tornado;
    }
}