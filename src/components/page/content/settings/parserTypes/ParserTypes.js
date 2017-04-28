import React from 'react'
import {RaisedButton} from 'material-ui'
import { assign, concat } from 'lodash'

import SettingTabs from '../SettingTabs'
import TabPage from 'components/shared/TabPage'
import TabPageBody from 'components/shared/TabPageBody'
import TabPageHeader from 'components/shared/TabPageHeader'

import InfiniteTable from '../../../../shared/InfiniteTable'
import ParserTypeModal from './ParserTypeModal'
import SimulationModal from './SimulationModal'

import { showAlert } from 'components/shared/Alert'

class ParserTypes extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}

    this.cells = [{
      'displayName': 'Name',
      'columnName': 'name'
    }, {
      'displayName': 'Filters',
      'columnName': 'filters'
    }]
  }
  componentWillMount () {
    // this.props.fetchParserTypes()
  }

  getTable () {
    return this.refs.table
  }

  onClickAdd () {
    this.props.openParserTypeModal()
  }

  onClickEdit () {
    const selected = this.getTable().getSelected()
    if (!selected) return showAlert('Please select parser type.')
    this.props.openParserTypeModal(selected)
  }

  onClickRemove () {
    const selected = this.getTable().getSelected()
    if (!selected) return showAlert('Please select parser type.')
    this.props.removeParserType(selected)
  }

  onClickSimulation () {
    const selected = this.getTable().getSelected()
    if (!selected) return showAlert('Please select parser type.')

    let filterChips = selected.filters.split('.*|.*').filter(t => !!t)
    if (filterChips.length > 1) {
      filterChips = filterChips.map((t, i) => {
        if (i === 0) return `${t}.*`
        if (i === filterChips.length - 1) return `.*${t}`
        return `.*${t}.*`
      })
    }

    const type = assign({}, {
      filterChips,
      patterns: concat([], selected.patterns)
    })
    this.props.openSimulationModal(type)
  }

  renderParserTypeModal () {
    if (!this.props.parserTypeModalOpen) return null
    return (
      <ParserTypeModal {...this.props}/>
    )
  }

  renderSimulationModal () {
    if (!this.props.simulationModalOpen) return null
    return (
      <SimulationModal {...this.props}/>
    )
  }

  render () {
    return (
      <TabPage>
        <TabPageHeader title="Settings">
          <div className="text-center margin-md-top">
            <div style={{position: 'absolute', right: '25px'}}>
              <RaisedButton label="Add" onTouchTap={this.onClickAdd.bind(this)}/>&nbsp;
              <RaisedButton label="Edit" onTouchTap={this.onClickEdit.bind(this)}/>&nbsp;
              <RaisedButton label="Remove" onTouchTap={this.onClickRemove.bind(this)}/>&nbsp;
              <RaisedButton label="Simulation" onTouchTap={this.onClickSimulation.bind(this)}/>&nbsp;
            </div>
          </div>
        </TabPageHeader>

        <TabPageBody tabs={SettingTabs} tab={8}>
          <InfiniteTable
            cells={this.cells}
            ref="table"
            rowMetadata={{'key': 'id'}}
            selectable
            onRowDblClick={this.onClickEdit.bind(this)}
            rowHeight={40}
            url="/parsertype"
            params={{
              draw: this.props.parserTypeDraw
            }}
          />

          {this.renderParserTypeModal()}
          {this.renderSimulationModal()}
        </TabPageBody>
      </TabPage>
    )
  }
}

export default ParserTypes
