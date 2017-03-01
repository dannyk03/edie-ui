import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-bootstrap-modal'
import DiagramPanel from './DiagramPanel'
import DiagramDragLayer from './DiagramDragLayer'
import DiagramDragItem from './DiagramDragItem'
import DiagramToolbar from './DiagramToolbar'
import { workflowItems } from './DiagramItems'
import { DiagramTypes } from 'shared/Global'

import DiagramObjectModal from './DiagramObjectModal'

const itemStyle = {
  width: '36px',
  height: '36px'
}

class DiagramModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      keyword: ''
    }
  }
  onHide () {

  }

  onClickClose () {
    this.props.closeDeviceWfDiagramModal()
  }

  onClickSave () {
    const { objects, lines, lastId, onClose } = this.props
    const data = {
      objects, lines, lastId
    }

    onClose && onClose(JSON.stringify(data))
    this.props.closeDeviceWfDiagramModal()
  }

  // ////////////////////////////////////////////////////
  onSearchChange (e) {
    const text = e.target.value
    if (this.state.text !== text) this.setState({ text })
  }

  onSearchKeyPress (e) {
    if (e.keyCode === 13) {
      this.setState({
        keyword: this.refs.search.value
      })
    }
  }

  onClickClear (e) {
    this.setState({ text: '', keyword: '' })
  }

  // ////////////////////////////////////////////////////

  onDrop (item, offset, component) {
    const node = ReactDOM.findDOMNode(component)
    const rt = node.getClientRects()[0]

    const w = 80
    const h = 50
    const object = {
      imgIndex: item.imgIndex,

      x: offset.x - rt.left - w / 2,
      y: offset.y - rt.top - h / 2,
      w,
      h,

      id: this.props.lastId + 1,
      type: DiagramTypes.OBJECT
    }

    this.props.openDiagramObjectModal(object)
  }

  // ////////////////////////////////////////////////////

  renderToolbar () {
    return (
      <DiagramToolbar {...this.props}/>
    )
  }

  renderSearch () {
    const { keyword, text } = this.state
    const filtered = keyword ? workflowItems.filter(m => m.title.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) : null

    let result = null
    if (filtered) {
      if (filtered.length) {
        result = filtered.map((m, index) =>
          <DiagramDragItem key={index} imgIndex={index}>
            <svg style={itemStyle}>{m.img}</svg>
          </DiagramDragItem>
        )
      } else {
        result = `No results for '${keyword}'`
      }
    }

    let searchBtn
    if (text) {
      searchBtn = <img src="/images/close2.png" style={{position: 'relative', left: '-18px', top: '-1px'}} onClick={this.onClickClear.bind(this)}/>
    } else {
      searchBtn = <img src="/images/search2.png" style={{position: 'relative', left: '-18px', top: '-1px'}} />
    }

    return (
      <div style={{display: 'block'}}>
        <div className="geSidebar" style={{boxSizing: 'border-box', overflow: 'hidden', width: '100%', padding: '5px'}}>
          <div style={{whiteSpace: 'nowrap', textOverflow: 'clip', paddingBottom: '8px', cursor: 'default'}}>
            <input placeholder="Search Shapes" type="text" ref="search"
              style={{fontSize: '12px', overflow: 'hidden', boxSizing: 'border-box', border: '1px solid rgb(213, 213, 213)', borderRadius: '4px', width: '100%', outline: 'none', padding: '6px 20px 6px 6px'}}
              onKeyUp={this.onSearchKeyPress.bind(this)} onChange={this.onSearchChange.bind(this)} value={text}/>
            { searchBtn }
          </div>

          {result}
        </div>
      </div>
    )
  }

  renderSidebar () {
    return (
      <div className="draw-sidebar">
        {this.renderSearch()}

        <a href="javascript:void(0);" className="geTitle">General</a>
        <div style={{padding: '5px'}}>
          {workflowItems.map((m, index) =>
            <DiagramDragItem key={index} imgIndex={index}>
              <svg style={itemStyle}>{m.img}</svg>
            </DiagramDragItem>
          )}
        </div>
      </div>
    )
  }

  renderPanel () {
    return (
      <DiagramPanel
        {...this.props}
        onDrop={this.onDrop.bind(this)}/>
    )
  }

  renderDragLayer () {
    return (
      <DiagramDragLayer/>
    )
  }

  renderObjectModal () {
    if (!this.props.objectModalOpen) return null

    const { closeDiagramObjectModal, objectConfig, addDiagramObject, updateDiagramObject, commands } = this.props
    return (
      <DiagramObjectModal
        closeModal={closeDiagramObjectModal}
        objectConfig={objectConfig}
        addDiagramObject={addDiagramObject}
        updateDiagramObject={updateDiagramObject}
        commands={commands}/>
    )
  }

  render () {
    return (
      <Modal
        show
        onHide={this.onHide.bind(this)}
        aria-labelledby="ModalHeader"
        className="bootstrap-dialog type-primary modal-md">
        <div className="modal-header">
          <h4 className="modal-title bootstrap-dialog-title">
            Workflow
          </h4>
          <div className="bootstrap-dialog-close-button">
            <button className="close" onClick={this.onClickClose.bind(this)}>×</button>
          </div>
        </div>
        <div className="modal-body bootstrap-dialog-message p-none">
          <div className="diagram">
            {this.renderDragLayer()}
            {this.renderToolbar()}
            <div className="flex-horizontal">
              {this.renderSidebar()}
              {this.renderPanel()}
            </div>
          </div>

          {this.renderObjectModal()}

          <div className="text-right panel-footer">
            <a href="javascript:;" className="btn btn-primary btn-sm margin-sm-right" onClick={this.onClickSave.bind(this)}>OK</a>
            <a href="javascript:;" className="btn btn-default btn-sm" onClick={this.onClickClose.bind(this)}>Cancel</a>
          </div>
        </div>
      </Modal>
    )
  }
}

export default DiagramModal
