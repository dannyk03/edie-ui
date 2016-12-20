import React from 'react'
import ReactDateRangePicker from 'react-bootstrap-daterangepicker'
import moment from 'moment'

export default class DateRangePicker extends React.Component {
    constructor(props) {
        super(props)

        let today = moment()
        let yesterday = moment().add(-1, "days")

        let rangeConfig =  {
            "Today": [
                today,
                today
            ],
            "Yesterday": [
                yesterday,
                yesterday
            ],
            "Last 7 Days": [
                moment().add(-6, "days"),
                today
            ],
            "Last 30 Days": [
                moment().add(-30, "days"),
                today
            ]
        };
        rangeConfig[moment().startOf("month").format("MMMM")] = [
            moment().startOf("month"),
            moment().endOf("month")
        ];
        rangeConfig[moment().add('-1', 'months').format("MMMM")] = [
            moment().startOf("month"),
            moment().endOf("month")
        ];

        rangeConfig[moment().startOf("years").format("YYYY")] = [
            moment().startOf("year"),
            moment().endOf("year"),
        ];
        rangeConfig[moment().add('-1', 'years').format("YYYY")] = [
            moment().add('-1', 'years').startOf("year"),
            moment().add('-1', 'years').endOf("year"),
        ];



        let config = {
            "ranges": rangeConfig,
            "linkedCalendars": true,
            "startDate": rangeConfig[this.props.default][0],
            "endDate": rangeConfig[this.props.default][1],
            "opens": "right"
        }

        //////////////////////////////////

        this.state = {
            config: config,
            label: this.props.default
        }
    }

    componentDidMount() {

    }


    render() {


        // dateRangePicker.daterangepicker(, function(start, end, label) {
        //     table && table.fnDraw();
        // });
        //
        // dateRangePicker.change(function(){
        //     $(this).attr('size', $(this).val().length || 1);
        // });
        // dateRangePicker.prev('i').click(function(){
        //     dateRangePicker.click();
        // });
        // dateRangePicker.val("Last 7 Days").change();


        return (
            <ReactDateRangePicker {...this.state.config}
                style={{display: "inline-block"}}
                className={this.props.className}
                onApply={this.onApply.bind(this)}>

                <a href="javascript:;">{this.state.label}{this.props.children}</a>

            </ReactDateRangePicker>
        )
    }

    onApply(e, dp) {

        // console.log(dp)

        let label = dp.chosenLabel;
        if (label == 'Custom Range') {
            label = dp.startDate.format("DD/MM/YYYY") + " - "
                + dp.endDate.format("DD/MM/YYYY")
        }

        this.state.config.startDate = dp.startDate;
        this.state.config.endDate = dp.endDate;
        this.setState({
            label: label,
            config: this.state.config,
        }, () => {
            this.props.onClickRange && this.props.onClickRange()
        })
    }

    getStartDate() {
        return this.state.config.startDate
    }

    getEndDate() {
        return this.state.config.endDate
    }
}

DateRangePicker.defaultProps = {
    default: "Last 7 Days"
}