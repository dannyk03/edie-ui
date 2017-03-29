import React, { Component } from 'react'
import moment from 'moment'
// import Select from 'react-select'
import { ButtonGroup, Button } from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'
import DateRangePicker from '../../../../../shared/DateRangePicker'
import AddIncidentModal from './AddIncidentModal'
import AddExceptionModal from './AddExceptionModal'
import CommentsModal from '../../../../../shared/incident/CommentsModal'
import MainTabs from '../MainTabs'
import TabPage from '../../../../../shared/TabPage'
import TabPageBody from '../../../../../shared/TabPageBody'
import TabPageHeader from '../../../../../shared/TabPageHeader'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import SearchBarContainer from 'containers/shared/search/SearchBarContainer'
import { inputStyle, selectedItemStyle } from 'style/materialStyles'

export default class MainIncidentsView extends Component {
  render () {
    const {device, incidents, selectedIndex, severities, selectedSeverity} = this.props
    let selectedIncident = selectedIndex < 0 ? null : incidents[selectedIndex]
    let selectedItem = this.props.selectedItem || 1
    return (
      <TabPage>
        <TabPageHeader title={device.name}>
          <div className="text-center margin-md-top">

            <div className="pull-left">
              <div className="flex-panel width-500">
                {/* <Select
                  value={this.props.selectedSeverity.join(',')}
                  options={this.props.severities}
                  onChange={this.props.onChangeSeverity}
                  multi
                  clearable={false}
                  className="select-severity"
                  style={{minWidth: '85px'}}
                  searchable={false}
                  autosize={false}
                  backspaceRemoves={false}
                /> */}
                <SelectField
                  style={{backgroundColor: '#ffffff', width: '200px'}}
                  underlineStyle={{display: 'none'}}
                  selectedMenuItemStyle={selectedItemStyle}
                  menuItemStyle={inputStyle}
                  labelStyle={inputStyle}
                  multiple
                  hintText="Select severities"
                  onChange={this.props.onChangeSeverity}
                  value={selectedSeverity}
                >
                  {severities.map(option =>
                    <MenuItem
                      key={option.value}
                      insetChildren
                      checked={selectedSeverity && selectedSeverity.includes(option.value)}
                      value={option.value}
                      primaryText={option.label}
                    />
                  )}
                </SelectField>

                <SelectField
                  style={{backgroundColor: '#ffffff', width: '150px'}}
                  underlineStyle={{display: 'none'}}
                  selectedMenuItemStyle={selectedItemStyle}
                  menuItemStyle={inputStyle}
                  labelStyle={inputStyle}
                  value={selectedItem}
                  onChange={this.props.onFilterChange}
                >
                  <MenuItem value={1} primaryText="Any" />
                  <MenuItem value={2} primaryText="Unfixed" />
                  <MenuItem value={3} primaryText="Fixed" />
                </SelectField>

                {/* <select className="fixtype form-control inline text-primary margin-md-left"
                  style={{maxWidth: '150px'}}
                  onChange={this.props.onFilterChange}
                  ref="fixed" defaultValue="false">
                  <option value="">Any</option>
                  <option value="false">Unfixed</option>
                  <option value="true">Fixed</option>
                </select> */}

                <DateRangePicker onClickRange={this.props.onFilterChange} className="margin-md-left"
                  default={moment().startOf('years').format('YYYY')} ref="dp">
                  <i className="fa fa-caret-down margin-xs-left" />
                </DateRangePicker>

                <a href="javascript:;" title="Export" style={{display: 'none'}}><img
                  width="26" src="/images/btn-export.jpg"/></a>
              </div>
            </div>

            <div className="pull-right">
              <ButtonGroup>

                <Button onClick={this.props.onClickOpen.bind(this)}>Open</Button>

                <Button onClick={this.props.onClickFixAll}>Fix All</Button>
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                >
                  <MenuItem primaryText="Add Incident" onTouchTap={this.props.onClickAddIncident}/>
                  <MenuItem primaryText="Add Exception" onTouchTap={this.props.onClickAddException}/>
                  <MenuItem primaryText="Export PDF" onTouchTap={this.props.onClickPDF}/>
                </IconMenu>

                {/* <DropdownButton title="More" id="dd-dev-incidents" pullRight>

                  <MenuItem eventKey="1" onClick={this.props.onClickAddIncident}>
                    Add Incident
                  </MenuItem>

                  <MenuItem eventKey="2" onClick={this.props.onClickAddException}>
                    Add Exception
                  </MenuItem>

                  <MenuItem eventKey="3" onClick={this.props.onClickPDF}>
                    Export PDF
                  </MenuItem>

                </DropdownButton> */}

              </ButtonGroup>
            </div>

            <div className="search-wrapper">
              <SearchBarContainer onSearch={this.props.onFilterChange}/>
              {/* <div className="inline" style={{position: 'relative'}}>
                <input type="text" placeholder="Search" className="form-control"
                  style={{width: '100%', paddingLeft: '35px'}}
                  onChange={this.props.onFilterChange}
                  ref="search"/>
                <a className="btn" href="javascript:;" style={{position: 'absolute', left: 0, top: 0}}>
                  <i className="fa fa-search" /></a>
              </div> */}
            </div>
          </div>
        </TabPageHeader>

        <TabPageBody tabs={MainTabs(device.id)} tab={0}>
          {this.props.table}
          {this.props.addIncidentModalVisible &&
          <AddIncidentModal {...this.props} open device={this.props.device}/>}
          {this.props.openExceptionModal &&
          <AddExceptionModal open incident={selectedIncident}
            onClose={this.props.onCloseExceptionModal}/>}

          {this.props.commentModalVisible &&
          <CommentsModal incident={selectedIncident}
            onClose={this.props.onCloseCommentsModal}/>}

          <ReactTooltip />
        </TabPageBody>
      </TabPage>
    )
  }
}
