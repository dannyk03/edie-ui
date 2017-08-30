import React from 'react'
import {IconButton, SelectField, MenuItem} from 'material-ui'
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle'
import {findIndex} from 'lodash'
import {parse} from 'query-string'
import {Route} from 'react-router-dom'


import MainDashboardView from './MainDashboardView'
import BoardListModal from './BoardListModal'

import MainDashboardRoute from './MainDashboardRoute'

export default class MainDashboard extends React.Component {
  componentWillMount () {
    this.props.selectGaugeBoard(null)
    this.props.fetchGaugeBoards()
  }
  componentWillUpdate (nextProps) {
    const {gaugeBoards} = nextProps
    if (!this.props.gaugeBoards.length && gaugeBoards.length) {
      const {id} = parse(this.props.location.search || {})
      let index = -1
      if (id) index = findIndex(gaugeBoards, {id})

      nextProps.selectGaugeBoard(gaugeBoards[index >= 0 ? index : 0].id, nextProps.history)
    }
  }
  getSelected () {
    const index = findIndex(this.props.gaugeBoards, {id: this.props.selectedGaugeBoard})
    if (index < 0) return null
    return this.props.gaugeBoards[index]
  }
  onChangeBoard (e, index, value) {
    this.props.selectGaugeBoard(value, this.props.history)
  }
  onClickAdd () {
    // showPrompt('Please type name.', '', name => {
    //   if (!name) return
    //   this.props.addGaugeBoard({
    //     name
    //   })
    // })
    this.props.showGaugeBoardsModal(true)
  }
  onClickSetDefault () {
    const board = this.getSelected()
    if (!board) return null
    this.props.setDefaultGaugeBoard(board)
  }
  getBoards () {
    return this.props.gaugeBoards
  }
  renderContent () {
    const board = this.getSelected()
    if (!board) return null
    return (
      <MainDashboardView board={board} {...this.props}/>
    )
  }
  renderBoardsModal () {
    if (!this.props.gaugeBoardsModalOpen) return
    return (
      <BoardListModal {...this.props}/>
    )
  }
  render () {
    return (
      <div className="tabs-custom flex-vertical flex-1">
        <div className="padding-lg-left">
          <SelectField
            floatingLabelText="Dashboard" value={this.props.selectedGaugeBoard} onChange={this.onChangeBoard.bind(this)}
            className="valign-top">
            {this.getBoards().map(p =>
              <MenuItem key={p.id} value={p.id} primaryText={p.name}/>
            )}
          </SelectField>
          <IconButton onTouchTap={this.onClickAdd.bind(this)} className="valign-bottom"><AddCircleIcon /></IconButton>
        </div>

        <div className="flex-vertical flex-1">
          {this.renderContent()}
          {this.renderBoardsModal()}
          <Route path="/dashboard/:id" component={MainDashboardRoute}/>
        </div>
      </div>
    )
  }
}
