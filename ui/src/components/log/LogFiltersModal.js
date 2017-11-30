import React from 'react'

import LogFiltersModalView from './LogFiltersModalView'
import {showConfirm, showAlert} from 'components/common/Alert'

export default class LogFiltersModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedSearch: null
    }
  }
  componentWillMount () {
    this.props.fetchLogFilters()
  }
  onClickRow (selectedSearch) {
    this.setState({
      selectedSearch
    })
  }
  onClickDelete (filter) {
    showConfirm('Click OK to remove', btn => {
      if (btn !== 'ok') return
      this.props.removeLogFilter(filter)
    })
  }
  onClickAdd () {
    const {keyword} = this.props
    if (!keyword) {
      return showAlert('Please type keyword first')
    }
    this.props.addLogFilter({
      keyword
    })
  }
  onClickEdit (filter) {
    const {keyword} = this.props
    if (!keyword) {
      return showAlert('Please type keyword first')
    }
    showConfirm('Click OK to overwrite', btn => {
      this.props.updateLogFilter({
        ...filter,
        keyword
      })
    })

  }

  render () {
    const {selectedSearch} = this.state
    const {onHide, logFilters} = this.props
    return (
      <LogFiltersModalView
        onHide={onHide}
        logFilters={logFilters}
        onClickRow={this.onClickRow.bind(this)}
        selectedSearch={selectedSearch}
        onClickAdd={this.onClickAdd.bind(this)}
        onClickDelete={this.onClickDelete.bind(this)}
        onClickEdit={this.onClickEdit.bind(this)}
      />
    )
  }
}
