import * as React from 'react';

import './style.scss';

interface IRadialChartProps {
    label: string;
    value: number;
    size?: number;
    format?: (value: number) => string;
}

interface IRadialChartState {
    strokeDasharray: number;
    strokeDashoffset: number;
}

export abstract class RadialChart extends React.Component<IRadialChartProps, IRadialChartState> {
    controlPath: any;
    percentPath: any;
    length: number;

    state = {
        strokeDasharray: 566,
        strokeDashoffset: -566
    }

    constructor(props) {
        super(props);

        this.length = 0;
    }

    render() {
        const size = this.props.size || 226,
            strokeWidth = 20,
            position = size/2;

        return <div className='radial-chart'>
            <svg width={size+2} height={size+2}>
                {/* <path
                    className='border'
                    strokeWidth={strokeWidth+2}
                    d={this.describeArc(position, position, (size/2 - strokeWidth/2)-1, 0, 359.9999)}
                /> */}

                <path
                    className='unfilled-path'
                    strokeWidth={strokeWidth}
                    d={this.describeArc(position, position, (size/2 - strokeWidth/2)-1, 0, 359.9999)}
                    ref={c => this.controlPath = c}
                />
                
                <path
                    className='filled-path'
                    stroke='url(#gradient)'
                    strokeWidth={strokeWidth}
                    d={this.describeArc(position, position, (size/2 - strokeWidth/2)-1, 0, 359.9999)}
                    ref={c => this.percentPath = c}
                    strokeDasharray={this.state.strokeDasharray}
                    strokeDashoffset={this.state.strokeDashoffset}
                />

                <linearGradient id='gradient' gradientUnits='objectBoundingBox' x1='0' y1='0' x2='1' y2='1'>
                    <stop stopColor='yellow'/>
                    <stop offset='100%' stopColor='red'/>
                </linearGradient>
            </svg>

            <div className='radial-chart-text'>
                <div className='radial-chart-title'>{this.props.label}</div>
                <div className='radial-chart-value'>{this.props.format ? this.props.format(this.props.value) : this.props.value}</div>
            </div>
        </div>;
    }

    componentDidMount() {
        this.length = this.controlPath.getTotalLength();
    }

    componentWillReceiveProps(props: IRadialChartProps) {
        this.setState({
            strokeDasharray: this.length,
            strokeDashoffset: this.length * (1 - props.value/100) * -1,
        });
    }

    private describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number){
        const start = this.polarToCartesian(x, y, radius, endAngle),
            end = this.polarToCartesian(x, y, radius, startAngle),
            largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    }

    private polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
        const angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }
}