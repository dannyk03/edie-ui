import React from 'react'
import Users from 'components/page/content/settings/users/Users'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  fetchSettingUsers,
  openSettingUserModal,
  deleteSettingUser,
  openUserPasswordModal,

  addSettingUser,
  updateSettingUser,
  closeSettingUserModal,

  closeUserPasswordModal
} from 'actions'

@connect(
  state => ({
    users: state.settings.users,
    userModalVisible: state.settings.userModalVisible,
    userPasswordModalVisible: state.settings.userPasswordModalVisible,

    editUser: state.settings.editUser
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

      closeUserPasswordModal
    }, dispatch)
  })
)
export default class UsersContainer extends React.Component {
  render () {
    return (
      <Users {...this.props} />
    )
  }
}
