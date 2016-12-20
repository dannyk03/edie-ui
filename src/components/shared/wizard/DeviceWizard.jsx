import React from 'react'
import Modal from 'react-bootstrap-modal'
import { Field, reduxForm, submit } from 'redux-form'
import { connect } from 'react-redux'
import {
    assign,
    keys,
    forIn,
    hasIn,
} from 'lodash'

import TextInput from './input/TextInput'
import Checkbox from './input/Checkbox'
import MonitorTable from './input/MonitorTable'

import {wizardConfig} from './WizardConfig.jsx'
import {util} from './WizardUtil.jsx'

import { fetchMonitorTemplates, clearDeviceWizardInitialValues } from 'actions/index'

class DeviceWizard extends React.Component {
    constructor(props) {
        super(props)

        let config = wizardConfig[this.props.deviceType]
        console.log("Device type: " + this.props.deviceType);

        this.state = {
            current: 1,
            steps: config.steps.length,

            currentDevice: config,

            monitors: props.monitors || [],

            inputs: {

            },
        }

        this.mapping = {
            'text'      : this.buildText.bind(this),
            // 'combo'     : this.buildCombo.bind(this),
            // 'radiogroup': this.buildRadioGroup.bind(this),
            // 'radiocombo': this.buildRadioCombo.bind(this),
            'check'     : this.buildCheck.bind(this),
            // 'checklist' : this.buildCheckList.bind(this),
            // 'label'     : this.buildLabel.bind(this),
            // 'password'  : this.buildPassword.bind(this),
            //
            // 'advanced'  : this.buildAdvanced.bind(this),
            // 'form'      : this.buildForm.bind(this),
            //
            // 'matchignore'   : this.buildMatchIgnore.bind(this),
            // 'globalignore'  : this.buildGlobalIgnore.bind(this),
            //
            'monitors'  : this.buildMonitors.bind(this),
            // 'mtable'    : this.buildMTable.bind(this),

            'row'       : this.buildRow.bind(this),
        }
    }

    componentWillMount() {

        const hasMonitors = this.state.currentDevice.steps.filter(s =>
            s.items.filter(i => i.type == 'monitors').length > 0
        ).length > 0

        if (hasMonitors)
            this.props.fetchMonitorTemplates()
    }

    componentDidMount() {
        this.props.clearDeviceWizardInitialValues()
    }

    render() {
        const { handleSubmit, onStep0 } = this.props
        const { current, steps } = this.state
        let cssPrevious = ""
        if (current < 2) cssPrevious = onStep0 ? "" : "hidden"

        return (
            <Modal show={true}
                   onHide={this.onHide.bind(this)}
                   aria-labelledby="ModalHeader"
                   className="bootstrap-dialog type-primary modal-device-wizard"
                   style={{width: "740px"}}>
                <div className="modal-header">
                    <h4 className="modal-title bootstrap-dialog-title">
                        {this.props.title || this.state.currentDevice.title || ''}
                    </h4>
                </div>
                <div className="modal-body bootstrap-dialog-message p-none">

                    <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
                          className="wizard-container"
                          ref="form">
                        {this.buildProgressBar()}

                        {this.buildContent()}

                        <div className="text-right mb-none">

                            <a href="javascript:;"
                               className="btn btn-default btn-sm"
                               onClick={this.onClickClose.bind(this)}>Cancel</a>

                            <a href="javascript:;"
                               className={"btn btn-default btn-sm margin-sm-left " + cssPrevious}
                               onClick={this.onClickPrevious.bind(this)}>Previous</a>

                            {
                                current < steps ?
                                    <a href="javascript:;" className="btn btn-primary btn-sm margin-sm-left"
                                       onClick={this.onClickNext.bind(this)}>Next</a>
                                    :
                                    <button action='submit' className="btn btn-primary btn-sm margin-sm-right">
                                        Finish</button>
                            }

                        </div>
                    </form>
                </div>
            </Modal>
        )
    }

    handleFormSubmit(formProps) {
        console.log(formProps)

        const { extraParams, onFinish } = this.props
        const { monitors } = this.state

        let props = assign({}, formProps, extraParams, { monitors })

        this.closeModal(true)
        onFinish && onFinish(null, props)
    }

    buildProgressBar() {
        if (this.state.steps <= 1) return null

        let markers = []
        for (let i = 1; i <=  this.state.steps; i++) {
            markers.push(
                <div className={"marker " + (i <= this.state.current ? 'marker-checked' : '')}
                     style={{left: 100 / this.state.steps * (i - 0.5) + '%'}}
                     key={i}>
                    <div className="marker-label">{i}</div>
                </div>
            )
        }

        return (
            <div className="wizard-progress">
                {markers}
                <div className="progress progress-striped progress-xs" style={{margin: "10px 0"}}>
                    <div className="progress-bar" style={{width: (100 * this.state.current / this.state.steps) + '%'}}></div>
                </div>
            </div>
        )
    }

    buildContent() {

        let tabs = []

        for(let i = 0; i < this.state.steps; i++) {
            let tab = this.buildStep(i)
            tabs.push(tab)
        }

        return (
            <div className="tab-content">
                {tabs}
            </div>
        )

    }

    buildStep(index) {
        const currentDevice = this.state.currentDevice
        const stepConfig = currentDevice.steps[index]

        let items= []

        stepConfig.items.forEach(itemConfig => {
            let inputs = this.buildInput(itemConfig, this.props.values)
            if (!inputs) return true

            items = items.concat(inputs)
        })

        return (
            <div key={index} className={"tab-pane p-none" + ((index == (this.state.current - 1)) ? " active" : "")}>
                {items}
            </div>
        )
    }

    buildInput(config, values) {
        let items = []

        if (this.props.hideNames && config.name) {
            let found = this.props.hideNames.indexOf(config.name) >= 0
            if (found) return items
        }

        config.type = config.type || ''
        let func = this.mapping[config.type.toLowerCase()]

        if (func != null){
            items = func(config, values || {});
        } else {
            console.error("Mapping not found! : " + config.type);
        }

        return items
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    buildText(config, values) {
        return <TextInput key={config.name}
                          config={config}
                          values={values}
                          buildLabel={this.buildLabel.bind(this)}/>
    }

    buildCombo(config, values) {

        return <Combo config={config}
                      values={values}
                      buildLabel={this.buildLabel.bind(this)}/>


    }

    buildRadioGroup(config, values) {
        return null
    }

    buildRadioCombo(config, values) {
        return <RadioCombo config={config}
                           values={values}
                           buildLabel={this.buildLabel.bind(this)}
                           buildInput={this.buildInput.bind(this)}/>
    }

    buildCheck(config, values) {
        return <Checkbox key={config.name}
                         config={config}
                         values={values}
                         buildLabel={this.buildLabel.bind(this)}/>
    }

    buildCheckList(config, values) {
        return <PortList config={config}
                         values={values}
                         name="portList"
                         buildInput={this.buildInput.bind(this)}/>
    }

    buildPassword(config, values) {
        var text = [];
        var width = util.calcWidth(config.width);

        if(config.label != null) {
            if(config.label.type == 'place'){
                //input.attr('placeholder', config.label.text || '');
            } else {
                text.push(this.buildLabel(config.label));
                width = util.calcWidth(config.width) - util.calcWidth(config.label.width);
            }
        }

        text.push(
            <div className={"col-md-" + util.calcWidth(config.width)}
                           style={util.convertStyle(config.style)}>
                <Password config={config} values={values}/>
            </div>
        );
        return text;
    }

    buildLabel(config) {
        return (
            <div className={"col-md-" + util.calcWidth(config.width)}
                style={util.convertStyle(config.style)}>
                <label className={"control-label " + (config.cls || '')}
                       dangerouslySetInnerHTML={{__html: config.html || config.text || ''}}
                />
            </div>
        )
    }

    buildAdvanced(config, values) {
        return <AdvancedForm config={config}
                             values={values}
                             name="advanced"
                             buildInput={this.buildInput.bind(this)}
                             buildLabel={this.buildLabel.bind(this)}/>
    }

    buildForm(config, values) {
        return null
    }

    buildMatchIgnore(config, values) {
        return <MatchIgnore name="matchIgnore"
                            values={values}
                            config={config}/>
    }

    buildGlobalIgnore(config, values) {
        return <GlobalIgnore name="globalIgnore"
                             values={values}
                             config={config}/>
    }

    buildMonitors(config, values) {
        return <MonitorTable key="monitors"
                             name="monitorList"
                             monitors={this.state.monitors}
                             templates={this.props.monitorTemplates}
                             onChanged={monitors => {this.setState({ monitors })}}
                             values={values}
                             config={config}/>
    }

    buildMTable(config, values) {

        return <MTable name="mTable"
                       values={values}
                       config={config}/>
    }

    buildRow(config, values) {

        let children = []
        let items = config.items || []
        items.forEach(item => {
            let inputs = this.buildInput(item, values)
            children = children.concat(inputs)
        })

        return (
            <div className="row margin-md-bottom">
                {children}
            </div>
        )
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    closeModal(data) {
        this.props.onClose &&
        this.props.onClose(this, data)
    }

    onHide() {
        this.onClickClose()
    }

    onClickClose() {
        this.closeModal()
    }

    onClickPrevious() {
        let current = this.state.current

        if (current > 1) {
            current--
            this.setState({current})
        } else {
            this.closeModal()
            this.props.onStep0 &&
                this.props.onStep0()
        }
    }

    onClickNext() {
        let current = this.state.current

        current++
        this.setState({ current })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

DeviceWizard.defaultProps = {
    title: '',

    deviceType: '',

    extraParams: {},
    configParams: {},

    hideNames: [],

    monitors: [],

    values: {},

    onStep0: null,
    onFinish: null,
}


DeviceWizard = reduxForm({
    form: 'deviceForm',
    // destroyOnUnmount: false,
    // validate
})(DeviceWizard)

function mapStateToProps(state) {
    return {
        monitorTemplates: state.settings.monitorTemplates,
    };
}

const actions = {
    fetchMonitorTemplates,
    clearDeviceWizardInitialValues
}

export default connect(mapStateToProps, actions)(DeviceWizard)