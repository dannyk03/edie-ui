import React from 'react'
import Users from 'components/sidebar/settings/users/Users'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {withRouter} from 'react-router'

import {
  fetchSettingUsers,
  openSettingUserModal,
  deleteSettingUser,
  openUserPasswordModal,

  addSettingUser,
  updateSettingUser,
  closeSettingUserModal,

  closeUserPasswordModal,

  openProfileModal,
  closeProfileModal,
  fetchUserInfo
} from 'actions'

@connect(
  state => ({
    users: state.settings.users,
    userModalVisible: state.settings.userModalVisible,
    userPasswordModalVisible: state.settings.userPasswordModalVisible,

    editUser: state.settings.editUser,

    user: state.dashboard.userInfo || {},
    maps: state.dashboard.maps,
    profileModalVisible: state.dashboard.profileModalVisible
  }),
  dispatch => ({
    ...bindActionCreators({
      fetchSettingUsers,
      openSettingUserModal,
      deleteSettingUser,
      openUserPasswordModal,

      addSettingUser,
      updateSettingUser,
      closeSettingUserModal,

      closeUserPasswordModal,

      openProfileModal,
      closeProfileModal,
      fetchUserInfo
    }, dispatch)
  })
)
@withRouter
export default class UsersContainer extends React.Component {
  render () {
    return (
      <Users {...this.props} />
    )
  }
}
