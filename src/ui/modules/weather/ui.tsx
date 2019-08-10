import * as React from 'react';

import { WeatherModule, IWeatherInfo, WeatherDay } from './sys';

import './style.scss';

export class Weather extends React.Component<{}, { info: IWeatherInfo }> {
    sys: WeatherModule;

    state = {
        info: {} as IWeatherInfo
    }

    constructor(props) {
        super(props);

        this.sys = new WeatherModule();
    }

    componentDidMount() {
        this.sys.on((info: IWeatherInfo) => this.setState({ info }))
    }

    render() {
        const info = this.state.info;
        return info ? <div className='ui-module weather'>
            {info.current && <WeatherEntry day={info.current} />}
            <div className='separator'></div>
            {(info.forecast || []).map((day: WeatherDay, i: number) => <WeatherEntry day={day} key={i} />)}
        </div> : <span />;
    }
}

const WeatherEntry = ({ day } : { day: WeatherDay }) => (
    <div className='weather-day'>
        <i className={`wi ${day.type.icon}`}></i>
        <br />
        <span className='temperature'>{Math.round(day.temperature)}°</span>
    </div>
)