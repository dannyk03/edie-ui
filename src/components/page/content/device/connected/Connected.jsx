import React from 'react'
import {
    DropdownButton,
    ButtonGroup,
    MenuItem,
    Button
} from 'react-bootstrap'
import Dimensions from 'react-dimensions'
import {withRouter} from 'react-router'
import { connect } from 'react-redux'

import TabPage from 'components/shared/TabPage'
import TabPageBody from 'components/shared/TabPageBody'
import TabPageHeader from 'components/shared/TabPageHeader'

class Connected extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            devices: []
        }
    }

    componentWillMount() {
        this.loadNetStats(this.buildDevices.bind(this))
    }

    render() {
        const {props} = this
        const {device} = props

        return (
            <TabPage>
                <TabPageHeader title={device.name}>
                </TabPageHeader>
                <TabPageBody>
                    {this.renderMap()}
                </TabPageBody>
            </TabPage>
        )
    }

    renderMap() {
        const {device} = this.props

        let imageUrl = '/images/' + device.picture

        let width = this.props.containerWidth
        let height = 600

        let center = {
            x: width / 2,
            y: height / 2,
        };

        let deviceLabel = this.deviceLabel(device.name, center)
        let deviceImage = this.deviceImage(imageUrl, center)
        let deviceObjs = this.renderDevices({
            width: width,
            height: height,
            center: center,
        })

        return (
            <svg style={{width: "100%", height: height + "px", backgroundColor: "rgb(35, 39, 45)"}}>
                {deviceObjs}
                {deviceImage}
                {deviceLabel}
            </svg>
        )
    }

    deviceLabel(label, pos) {
        return (
            <text textAnchor="middle"
                  x={pos.x}
                  y={pos.y + 30}
                  height="24"
                  fill="#fff"
                  fontSize="0.9em">
                {label}
            </text>
        )
    }

    deviceImage(imageUrl, pos) {
        return (
            <image x={pos.x - 21}
                   y={pos.y - 21}
                   width="42"
                   height="42"
                   href={imageUrl}
                   style={{cursor: "pointer", opacity: "1"}}>
            </image>
        )
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    loadNetStats(cb) {

        cb([])
        // const {location} = this.props
        // let props = location.state || {}
        // const {device} = props
        //
        // $.get(Api.incidents.getNetStats, {
        //     deviceid: device.id,
        // }).done(res => {
        //     cb && cb(res)
        // })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    buildDevices(stats) {

        let icons = $('#devicediv #devcollapse2 li .item-icon img');

        let devices = []

        let r = () => {return parseInt(Math.random() * 10000) % 256}

        for(let i = 0;i < stats.length; i++) {
            let alpha = Math.PI * 2 * i / stats.length;//Math.random() * Math.PI * 2;
            let device = {
                id: 100 + i,
                name: r() + "." + r() + "." + r() + "." + r() ,//i > 0 ? stats[i - 1].foreignIP : '',
                attacks: 0,

                data: stats[i],

                alpha: alpha,
                img: icons.eq(parseInt(Math.random() * (icons.length - 1))).attr('src'),
                devicetype: icons.data('type'),
                visible: false,
                bubbles: [],
            }

            devices.push(device);
        }

        this.setState({devices})
    }

    renderDevices(o) {
        let devices = this.state.devices

        let items = []


        var pos = "M{0},{1},{2},{3}";

        let from = o.center

        devices.forEach(device => {
            let alpha = device.alpha
            let x = o.center.x + Math.cos(alpha) * o.center.x * 0.5
            let y = o.center.y + Math.sin(alpha) * o.center.y * 0.5


            let arcSharpness = 4 * Math.random()
            let midXY = [(from.x + x) / 2, (from.y + y) / 2]
            let cx = midXY[0] + (50 * arcSharpness)
            let cy = Math.abs(midXY[1] - (50 * arcSharpness))


            let textAngle = 0
            if (x > from.x) {
                textAngle = Math.atan2(y - from.y, x - from.x);
            } else {
                textAngle = Math.atan2(from.y - y, from.x - x);
            }
            textAngle *= 180 / Math.PI;

            items.push(
                <text key={"dev-port-" + device.id}
                      textAnchor="middle"
                      x={midXY[0]}
                      y={midXY[1]}
                      fill="white"
                      transform={"rotate(" + textAngle + " " + midXY[0] + "," + (midXY[1] + 10) + ")"}
                      fontSize=".8em">
                    {device.data['foreignPort']}
                </text>
            )

            items.push(
                <path key={"line-" + device.id}
                      style={{strokeLinecap:"round", stroke:"red", fill:"none", strokeWidth:"2"}}
                      d={pos.format(from.x, from.y, x, y)}>
                </path>
            )

            items.push(
                <image key={"dev-" + device.id}
                       x={x - 21}
                       y={y - 30}
                       width="42"
                       height="42"
                       href={device.img}
                       style={{cursor: "pointer", opacity: "1"}}>
                </image>
            )

            items.push(
                <text key={"label-" + device.id}
                      textAnchor="middle"
                      x={x}
                      y={y + 21}
                      width="80"
                      height="24"
                      fill="#fff"
                      fontSize="0.9em">
                    {device.name}
                </text>
            )
        })

        return items
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

Connected.defaultProps = {
}

function mapStateToProps(state) {
    return {device: state.dashboard.selectedDevice}
}

export default withRouter(connect(mapStateToProps)(Dimensions()(Connected)))