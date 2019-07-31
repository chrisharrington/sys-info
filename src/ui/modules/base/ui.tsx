import * as React from 'react';

require('kute.js/kute-svg');

interface IRadialChartProps {
    label: string;
    value: number;
    size?: number;
}

interface IRadialChartState {
    strokeDasharray: number;
    strokeDashoffset: number;
}

export abstract class RadialChart extends React.Component<IRadialChartProps, IRadialChartState> {
    controlPath: any;
    percentPath: any;

    state = {
        strokeDasharray: 0,
        strokeDashoffset: 0
    }

    render() {
        const size = this.props.size || 200,
            strokeWidth = 20;

        return <div className='radial-chart'>
            <svg width={size} height={size} style={{ backgroundColor: 'white' }}>
                <path
                    fill='none'
                    stroke='#DDD'
                    strokeWidth={strokeWidth} d={this.describeArc(size/2, size/2, size/2 - strokeWidth/2, 0, 359.9999)}
                    ref={c => this.controlPath = c}
                />

                <path
                    fill='none'
                    stroke='orange'
                    strokeWidth={strokeWidth} d={this.describeArc(size/2, size/2, size/2 - strokeWidth/2, 0, 359.9999)}
                    ref={c => this.percentPath = c}
                    strokeDasharray={this.state.strokeDasharray}
                    strokeDashoffset={this.state.strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 400ms'}}
                />
            </svg>
        </div>;
    }

    componentDidMount() {
        const length = this.controlPath.getTotalLength();
        this.setState({
            strokeDasharray: length,
            strokeDashoffset: length
        });
    }

    componentWillReceiveProps(props: IRadialChartProps) {
        const value = Math.random();//this.props.value;

        this.setState({
            strokeDashoffset: this.state.strokeDasharray * (1 - value) * -1
        }, () => console.log(this.state.strokeDashoffset));
    }

    private polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
        const angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }
      
    private describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number){
        const start = this.polarToCartesian(x, y, radius, endAngle),
            end = this.polarToCartesian(x, y, radius, startAngle),
            largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    }
}