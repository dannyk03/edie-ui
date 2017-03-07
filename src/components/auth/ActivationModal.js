import React, { Component } from 'react'
import {showAlert} from 'components/shared/Alert'
import { reduxForm } from 'redux-form'
import ActivationModalView from '../modal/ActivationModalView'
import { validate } from '../modal/validation/LicenseValidation'

class ActivationModal extends Component {
  componentWillUpdate (nextProps, nextState) {
    const {activationMsg} = this.props
    if (nextProps.activationMsg && activationMsg !== nextProps.activationMsg) {
      showAlert(nextProps.activationMsg)
    }
  }

  onClickSignup () {
    const params = {
      email: this.refs.email.value,
      license: this.refs.license.value
    }

    if (!params.email) return window.alert('Email can\'t be blank.')
    if (!params.license) return window.alert('License can\'t be blank.')
    this.props.activateUser(params)
  }

  onHide () {

  }

  render () {
    return (
      <ActivationModalView
        onHide={this.onHide.bind(this)}
        onSignup={this.onClickSignup.bind(this)}
      />
    )
  }
}

export default reduxForm({
  form: 'activationModal',
  validate
})(ActivationModal)
