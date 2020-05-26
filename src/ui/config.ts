export default class Config {
    static WeatherForecastApiUrl: string = 'https://weather.api.here.com/weather/1.0/report.json?app_id={WEATHER_APP_ID}&app_code={WEATHER_APP_CODE}&product=forecast_7days_simple&latitude=51.174937&longitude=-114.128854'
    static WeatherCurrentApiUrl: string = 'https://weather.api.here.com/weather/1.0/report.json?app_id={WEATHER_APP_ID}&app_code={WEATHER_APP_CODE}&product=observation&latitude=51.174937&longitude=-114.128854'
}