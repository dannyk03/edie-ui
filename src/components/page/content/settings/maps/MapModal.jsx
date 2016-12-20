import React from 'react'
import Modal from 'react-bootstrap-modal'
import {
    Button,
} from 'react-bootstrap'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { assign } from 'lodash'

import { showAlert } from 'components/shared/Alert.jsx'

import {
    addSettingMap,
    updateSettingMap,
    closeSettingMapModal
} from 'actions/index'

const renderInput = field => (
    <div className="row margin-md-bottom">
        <label className="control-label col-md-3 padding-sm-top">{field.label}</label>
        <div className="col-md-9 margin-sm-bottom">
            <input {...field.input} type={field.type} className="form-control"/>
        </div>
    </div>
)


class MapModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { map, handleSubmit } = this.props
        const isDefault = false//map ? user.defaultmap == map.id : false

        return (
            <Modal show={true} onHide={this.onHide.bind(this)}
                   aria-labelledby="ModalHeader" className="bootstrap-dialog type-primary">

                <div className="modal-header">
                    <h4 className="modal-title bootstrap-dialog-title">
                        Map
                    </h4>
                    <div className="bootstrap-dialog-close-button">
                        <button className="close"
                                onClick={this.onClickClose.bind(this)}>×</button>
                    </div>
                </div>

                <div className="modal-body bootstrap-dialog-message">

                    <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                        <Field name="name" component={renderInput} type="text" label="Name"/>
                        <Field name="mapgroup" component={renderInput} type="text" label="Group"/>

                        <div className="text-right p-none">
                            <Button className="btn-primary" type="submit">Save</Button>
                            <Button className="margin-sm-left"
                                    onClick={this.onClickClose.bind(this)}>Cancel</Button>
                        </div>
                    </form>
                </div>
            </Modal>
        )
    }

    onHide() {
        this.onClickClose()
    }

    closeModal() {
        this.props.closeSettingMapModal()
    }

    handleFormSubmit(values) {
        const {editMap} = this.props

        console.log(values)

        let map = assign({}, editMap, values)

        if (!map.name) {
            return showAlert("Please type name.")
        }

        if (editMap) {
            this.props.updateSettingMap(map)
        } else {
            this.props.addSettingMap(map)
        }

    }

    onClickClose() {
        this.closeModal()
    }

    /////////////////////////////////////////////////////////////////////////

    onKeyUpInput(e) {
        if (e.keyCode == 13) {
            this.onClickSave()
        }
    }

}

MapModal.defaultProps = {

}


MapModal = reduxForm({
    form: 'mapEditForm'
})(MapModal)


function mapStateToProps(state) {
    return {
        editMap: state.settings.editMap,
        initialValues: state.settings.editMap
    }
}

const actions = {
    addSettingMap,
    updateSettingMap,
    closeSettingMapModal
}

export default connect(mapStateToProps, actions)(MapModal)