import React from 'react'
import {
    ButtonGroup,
    Button,
    DropdownButton,
    MenuItem
} from 'react-bootstrap'


import MainSettings from './MainSettings.jsx'
import Websocket from './websocket/Websocket.jsx'
import Routing from './routing/Routing.jsx'

import SettingTabs from '../SettingTabs'
import TabPage from 'components/shared/TabPage'
import TabPageBody from 'components/shared/TabPageBody'
import TabPageHeader from 'components/shared/TabPageHeader'


class Advanced extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pageIndex: 0,
        }

        // this.listeners = {
        //     [EVENTS.ADVANCED_TAB_CLICKED]: this.onTabClicked.bind(this),
        // }
    }

    render() {
        const {pageIndex} = this.state
        return (
            <TabPage>
                <TabPageHeader title="Settings">
                    <div className="text-center margin-md-top">
                        <div style={{position:"absolute", right:"25px"}}>
                            <ButtonGroup>

                                <DropdownButton title="Routing" id="dd-setting-routing" pullRight={true}
                                                className={pageIndex == 2 ? '' : 'hidden'}>
                                    <MenuItem eventKey="1"  onClick={this.onClickAddRouting.bind(this)}>Add</MenuItem>
                                    <MenuItem eventKey="2"  onClick={this.onClickEditRouting.bind(this)}>Edit</MenuItem>
                                </DropdownButton>

                                <DropdownButton title={<i className="fa fa-gear"/>}
                                                id="dd-setting-adv-more" pullRight={true}>

                                    <MenuItem eventKey="1" onClick={this.onClickTab.bind(this, 0)}>
                                        <span className={pageIndex == 0 ? "text-bold" : ""}>Main</span></MenuItem>
                                    <MenuItem eventKey="2" onClick={this.onClickTab.bind(this, 1)}>
                                        <span className={pageIndex == 1 ? "text-bold" : ""}>Websocket</span></MenuItem>
                                    <MenuItem eventKey="3" onClick={this.onClickTab.bind(this, 2)}>
                                        <span className={pageIndex == 2 ? "text-bold" : ""}>Routing</span></MenuItem>

                                </DropdownButton>

                            </ButtonGroup>
                        </div>
                    </div>
                </TabPageHeader>

                <TabPageBody tabs={SettingTabs} tab={8}>
                    {this.renderContent()}
                </TabPageBody>
            </TabPage>
        )
    }

    renderContent() {
        switch(this.state.pageIndex) {
            case 1: return <Websocket />
            case 2: return <Routing />
        }

        return <MainSettings />
    }

    /////////////////////////////////////////////

    onClickTab(pageIndex) {
        this.setState({ pageIndex })
    }

    onClickAddRouting() {

    }

    onClickEditRouting() {

    }
}

Advanced.defaultProps = {}

export default Advanced