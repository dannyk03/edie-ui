import React from 'react'
import {
    ButtonGroup,
    Button,
    Tabs,
    Tab
} from 'react-bootstrap'
import {withRouter} from 'react-router'

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentWillMount() {
        if (!this.props.children) {
            this.props.router.replace('/search/incidents')
        }
    }

    render() {
        return this.props.children
    }

    render2() {
        return (
            <TabPage>
                <TabPageHeader title="Search">
                    <div style={{margin: "0 auto", position: 'relative', textAlign: 'center'}}>
                        <div className="pull-left">
                            <div className="form-inline">

                            </div>
                        </div>
                        <div className="pull-right">
                            <ButtonGroup>

                            </ButtonGroup>
                        </div>
                    </div>
                </TabPageHeader>

                <TabPageBody>
                    <div style={{backgroundColor: 'white'}} className="padding-sm">

                    </div>
                </TabPageBody>
            </TabPage>
        )
    }
}

Search.defaultProps = {
}

export default withRouter(Search)