import request from 'request';

import Config from '../../config';

import BaseModule from '../base/sys';

export interface IWeatherInfo {
    current: WeatherDay;
    forecast: WeatherDay[]
}

export class WeatherModule extends BaseModule<IWeatherInfo> {
    constructor() {
        super(15*60*1000);
    }

    protected async get() : Promise<IWeatherInfo> {
        const [forecast, current] = await Promise.all([
            this.forecast(),
            this.current()
        ]);

        return { forecast, current };
    }

    private async forecast() : Promise<WeatherDay[]> {
        return new Promise<WeatherDay[]>(resolve => {
            let url = Config.WeatherForecastApiUrl;
            url = url.replace('{WEATHER_APP_ID}', process.env.WEATHER_APP_ID || '');
            url = url.replace('{WEATHER_APP_CODE}', process.env.WEATHER_APP_CODE || '');

            request(url, function (error, response, body) {
                let parsed = JSON.parse(body);
                resolve(parsed.dailyForecasts.forecastLocation.forecast.slice(0, 3).map(weather => ({
                    temperature: weather.highTemperature,
                    type: WeatherType.getFromRemote(weather.iconName)
                })));
            });
        });
    }

    private async current() : Promise<WeatherDay> {
        return new Promise<WeatherDay>(resolve => {
            let url = Config.WeatherCurrentApiUrl;
            url = url.replace('{WEATHER_APP_ID}', process.env.WEATHER_APP_ID || '');
            url = url.replace('{WEATHER_APP_CODE}', process.env.WEATHER_APP_CODE || '');

            request(url, function (error, response, body) {
                const data = JSON.parse(body).observations.location[0].observation[0];
                resolve({
                    temperature: data.temperature,
                    type: WeatherType.getFromRemote(data.iconName)
                });
            });
        });
    }
}

export class WeatherDay {
    temperature: number;
    type: WeatherSubType;
    icon?: string;
}

export class WeatherSubType {
    remotes: string[];
    icon: string;

    constructor(icon: string, remotes: string[]) {
        this.remotes = remotes;
        this.icon = icon;
    }
}

export class WeatherType {
    static ClearDay: WeatherSubType = new WeatherSubType('wi-day-sunny', [
        'sunny',
        'clear'
    ]);
    static ClearNight: WeatherSubType = new WeatherSubType('wi-night-clear', [
        'night_clear',
        'night_mostly_clear'
    ]);
    static Rain: WeatherSubType = new WeatherSubType('wi-rain', [
        'rain_early',
        'heavy_rain_early',
        'heavy_rain',
        'lots_of_rain',
        'tons_of_rain',
        'heavy_rain_early',
        'heavy_rain_late',
        'flash_floods',
        'flood',
        'rain',
        'numerous_showers',
        'rain_early',
        'tropical_storm',
        'hurricane',
        'rain_late'
    ]);
    static Showers: WeatherSubType = new WeatherSubType('wi-day-showers', [
        'scattered_showers',
        'a_few_showers',
        'light_showers',
        'passing_showers',
        'rain_showers',
        'showers',
        'night_scattered_showers',
        'night_a_few_showers',
        'night_light_showers',
        'night_passing_showers',
        'night_rain_showers',
        'night_sprinkles',
        'night_showers',
        'drizzle',
        'sprinkles',
        'light_rain',
        'sprinkles_early',
        'light_rain_early',
        'sprinkles_late',
        'light_rain_late',
        'showery',
        'showers_early',
        'showers_late'
    ]);
    static Snow: WeatherSubType = new WeatherSubType('wi-snow', [
        'scattered_flurries',
        'snow_flurries',
        'light_snow_showers',
        'snow_showers',
        'light_snow',
        'flurries_early',
        'snow_showers_early',
        'light_snow_early',
        'flurries_late',
        'snow_showers_late',
        'light_snow_late',
        'snow',
        'moderate_snow',
        'snow_early',
        'snow_late',
        'heavy_snow',
        'heavy_snow_early',
        'heavy_snow_late',
        'snowstorm',
        'blizzard'
    ]);
    static Sleet: WeatherSubType = new WeatherSubType('wi-sleet', [
        'hail',
        'sleet',
        'light_mixture_of_precip',
        'icy_mix',
        'mixture_of_precip',
        'heavy_mixture_of_precip',
        'snow_changing_to_rain',
        'snow_changing_to_an_icy_mix',
        'an_icy_mix_changing_to_snow',
        'an_icy_mix_changing_to_rain',
        'rain_changing_to_snow',
        'rain_changing_to_an_icy_mix',
        'light_icy_mix_early',
        'icy_mix_early',
        'light_icy_mix_late',
        'icy_mix_late',
        'snow_rain_mix',
        'light_freezing_rain',
        'freezing_rain'
    ]);
    static Fog: WeatherSubType = new WeatherSubType('wi-fog', [
        'ice_fog',
        'hazy_sunshine',
        'haze',
        'smoke',
        'low_level_haze',
        'early_fog_followed_by_sunny_skies',
        'early_fog',
        'light_fog',
        'fog',
        'dense_fog',
        'night_haze',
        'night_smoke',
        'night_low_level_haze'
    ]);
    static Cloudy: WeatherSubType = new WeatherSubType('wi-cloud', [
        'morning_clouds',
        'afternoon_clouds',
        'high_clouds',
        'night_high_level_clouds',
        'night_high_clouds'
    ]);
    static PartlyCloudyDay: WeatherSubType = new WeatherSubType('wi-day-cloudy', [
        'mostly_sunny',
        'mostly_clear',
        'passing_clouds',
        'partly_cloudy',
        'increasing_cloudiness',
        'breaks_of_sun_late',
        'partly_sunny',
        'high_level_clouds',
        'more_clouds_than_sun',
        'broken_clouds',
        'mostly_cloudy',
        'cloudy',
        'overcast',
        'low_clouds'
    ]);
    static BarelyCloudyDay: WeatherSubType = new WeatherSubType('wi-day-sunny-overcast', [
        'scattered_clouds',
        'more_sun_than_clouds',
        'a_mixture_of_sun_and_clouds',
        'decreasing_cloudiness',
        'clearing_skies',
    ]);
    static PartlyCloudyNight: WeatherSubType = new WeatherSubType('wi-night-alt-cloudy', [
        'night_decreasing_cloudiness',
        'night_clearing_skies',
        'night_passing_clouds',
        'night_scattered_clouds',
        'night_partly_cloudy',
        'night_afternoon_clouds',
        'night_morning_clouds',
        'night_broken_clouds',
        'night_mostly_cloudy'
    ]);
    static Thunderstorm: WeatherSubType = new WeatherSubType('wi-thunderstorm', [
        'strong_thunderstorms',
        'severe_thunderstorms',
        'thundershowers',
        'thunderstorms',
        'tstorms_early',
        'isolated_tstorms_late',
        'scattered_tstorms_late',
        'tstorms_late',
        'tstorms',
        'widely_scattered_tstorms',
        'isolated_tstorms',
        'a_few_tstorms',
        'scattered_tstorms',
        'night_widely_scattered_tstorms',
        'night_isolated_tstorms',
        'night_a_few_tstorms',
        'night_scattered_tstorms',
        'night_tstorms'
    ]);
    static Tornado: WeatherSubType = new WeatherSubType('wi-tornado', [
        'tornado'
    ]);

    static getFromRemote(value: string) : WeatherSubType {
        for (var name in WeatherType)
            if (WeatherType[name].remotes && WeatherType[name].remotes.indexOf(value) > -1)
                return WeatherType[name];
        return WeatherType.Tornado;
    }
}







