import React from 'react'
import AppletCard from 'components/common/AppletCard'
import { extImageBaseUrl, appletColors as colors } from 'shared/Global'

export default class Device extends React.Component {
  renderTpl (tpl, i) {
    const {onClickMenuItem} = this.props
    return (
      <AppletCard
        key={tpl.id}
        color={colors[i % colors.length]}
        name={tpl.templateName}
        desc={tpl.name}
        img={`${extImageBaseUrl}${tpl.image}`}
        onClick={() => onClickMenuItem(tpl)}
      />
    )
  }
  render() {
    return (
      <ul className="web-applet-cards">
        {this.props.devices.map(this.renderTpl.bind(this))}
      </ul>
    )
  }
}