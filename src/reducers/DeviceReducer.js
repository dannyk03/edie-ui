import {
  FETCH_DEVICES,
  FETCH_DEVICE_INCIDENTS,
  ADD_DEVICE_INCIDENT,
  OPEN_ADD_DEVICE_INCIDENT,
  UPDATE_DEVICE_INCIDENT,
  CLOSE_ADD_DEVICE_INCIDENT,

  FETCH_GROUP_DEVICES_LINES,
  ADD_GROUP_DEVICE,
  UPDATE_GROUP_DEVICE,
  REMOVE_GROUP_DEVICE,
  ADD_GROUP_LINE,
  UPDATE_GROUP_LINE,
  REMOVE_GROUP_LINE,

  FETCH_DEVICE_WORKFLOWS,
  FETCH_DEVICE_EVENTS,
  FETCH_DEVICE_PHYSICAL_RULES,
  FETCH_DEVICE_BASIC_MONITORS,
  FETCH_DEVICE_MONITORS,
  FETCH_DEVICE_EVENTLOG,
  FETCH_DEVICE_APPS,
  FETCH_DEVICE_PROCESS,
  OPEN_PROCESS_MODAL,
  CLOSE_PROCESS_MODAL,

  OPEN_SYS_WORKFLOWS_MODAL,
  CLOSE_SYS_WORKFLOWS_MODAL,
  SELECT_SYS_WORKFLOW,
  DESELECT_SYS_WORKFLOW,
  SELECT_SYS_WORKFLOW_CATEGORY,

  OPEN_DEVICE_MONITOR_PICKER,
  CLOSE_DEVICE_MONITOR_PICKER,

  OPEN_DEVICE_MONITOR_WIZARD,
  CLOSE_DEVICE_MONITOR_WIZARD,
  CLEAR_DEVICE_WIZARD_INITIAL_VALUES,

  OPEN_PARAMS_MODAL,
  CLOSE_PARAMS_MODAL,
  OPEN_PARAM_EDIT_MODAL,
  CLOSE_PARAM_EDIT_MODAL,
  ADD_PARAM,
  UPDATE_PARAM,
  REMOVE_PARAM,
  UPDATE_MONITOR_PARAMS,

  OPEN_DEVICE_EDIT_MODAL,
  CLOSE_DEVICE_EDIT_MODAL,

  OPEN_DEVICE_WORKFLOW_MODAL,
  CLOSE_DEVICE_WORKFLOW_MODAL,
  ADD_DEVICE_WORKFLOW,
  UPDATE_DEVICE_WORKFLOW,
  REMOVE_DEVICE_WORKFLOW,
  OPEN_DEVICE_WF_DIAGRAM_MODAL,
  CLOSE_DEVICE_WF_DIAGRAM_MODAL,

  OPEN_DEVICE_RULE_MODAL,
  CLOSE_DEVICE_RULE_MODAL,

  FETCH_WORKFLOW_CATEGORIES,
  SELECT_WORKFLOW_CATEGORY,
  OPEN_WF_CATEGORY_MODAL,
  CLOSE_WF_CATEGORY_MODAL,
  ADD_WF_CATEGORY,

  OPEN_WF_ACTION_MODAL,
  CLOSE_WF_ACTION_MODAL,

  FIX_ALL_DEVICE_INCIDENTS,

  CLOSE_DEVICE,

  FETCH_MONITOR_OS,
  FETCH_MONITOR_DISK,
  FETCH_MONITOR_CPU,
  FETCH_MONITOR_MEMORY,
  CLEAR_MONITORS,

  UPDATE_DEVICE_ERROR
} from '../actions/types'

import { concat, keys } from 'lodash'

const INITIAL_STATE = { devices: [] }

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_DEVICES:
      return { ...state, devices: action.payload }

    case FETCH_DEVICE_INCIDENTS:
      return { ...state, incidents: action.data }

    case CLOSE_DEVICE:
      return { ...state, devices: [] }

    case ADD_DEVICE_INCIDENT: {
      const incidents = concat(action.data, state.incidents || [])
      return { ...state, incidents }
    }

    case UPDATE_DEVICE_INCIDENT: {
      const incidents = state.incidents.map(u => {
        if (u.id === action.data.id) return action.data
        return u
      })
      return { ...state, incidents }
    }

    case OPEN_ADD_DEVICE_INCIDENT:
      return { ...state, addIncidentModalVisible: true }

    case CLOSE_ADD_DEVICE_INCIDENT:
      return { ...state, addIncidentModalVisible: false }

    case OPEN_DEVICE_MONITOR_PICKER:
      return { ...state, monitorPickerVisible: true }

    case CLOSE_DEVICE_MONITOR_PICKER:
      return { ...state, monitorPickerVisible: false }

    case OPEN_DEVICE_MONITOR_WIZARD: {
      const params = action.data ? (action.data.params || {}) : {}
      const editParams = keys(params).map(key => ({
        key,
        value: params[key]
      }))
      console.log(action.data)
      return { ...state, monitorWizardVisible: true, monitorInitialValues: action.data, editParams }
    }

    case CLOSE_DEVICE_MONITOR_WIZARD:
      return { ...state, monitorWizardVisible: false }

    case CLEAR_DEVICE_WIZARD_INITIAL_VALUES:
      return { ...state, wizardInitialValues: null }

    // case FETCH_DEVICE_RULES:
    //   return { ...state, rules: action.data }

    case FETCH_DEVICE_WORKFLOWS:
      return { ...state, workflows: action.data }

    case OPEN_DEVICE_WORKFLOW_MODAL:
      return { ...state, workflowModalOpen: true, editWorkflow: action.data }

    case CLOSE_DEVICE_WORKFLOW_MODAL:
      return { ...state, workflowModalOpen: false }

    case ADD_DEVICE_WORKFLOW:
    case UPDATE_DEVICE_WORKFLOW:
    case REMOVE_DEVICE_WORKFLOW:
      return { ...state, workflowListDraw: state.workflowListDraw + 1 }

    case OPEN_DEVICE_WF_DIAGRAM_MODAL:
      return { ...state, wfDiagramModalOpen: true }

    case CLOSE_DEVICE_WF_DIAGRAM_MODAL:
      return { ...state, wfDiagramModalOpen: false }

    case OPEN_DEVICE_RULE_MODAL:
      return { ...state, ruleModalOpen: true, editRule: action.data }

    case CLOSE_DEVICE_RULE_MODAL:
      return { ...state, ruleModalOpen: false }

    case FETCH_DEVICE_EVENTS:
      return { ...state, events: action.data }

    case FETCH_DEVICE_PHYSICAL_RULES:
      return { ...state, physicalRules: action.data }

    case FETCH_DEVICE_BASIC_MONITORS:
      return { ...state, basicMonitors: action.data }

    case FETCH_DEVICE_MONITORS:
      return { ...state, monitors: action.data }

    case FETCH_DEVICE_EVENTLOG:
      return { ...state, eventLogs: action.data }

    case FETCH_DEVICE_APPS:
      return { ...state, apps: action.data }

    case FETCH_DEVICE_PROCESS:
      return { ...state, processes: action.data }

    case OPEN_PROCESS_MODAL:
      return { ...state, processModalOpen: true, process: action.process }
    case CLOSE_PROCESS_MODAL:
      return { ...state, processModalOpen: false }

    case OPEN_DEVICE_EDIT_MODAL:
      return { ...state, openModal: true, editDevice: action.device, updateDeviceError: '' }

    case CLOSE_DEVICE_EDIT_MODAL:
      return { ...state, openModal: false }

    case UPDATE_DEVICE_ERROR:
      return { ...state, updateDeviceError: action.msg }

    case FETCH_WORKFLOW_CATEGORIES:
      return { ...state, workflowCategories: action.data }

    case SELECT_WORKFLOW_CATEGORY:
      return { ...state, selectedWorkflowCategory: action.category }

    case OPEN_WF_CATEGORY_MODAL:
      return { ...state, wfCategoryModalOpen: true, editWfCategory: action.data }

    case CLOSE_WF_CATEGORY_MODAL:
      return { ...state, wfCategoryModalOpen: false }

    case ADD_WF_CATEGORY:
      return { ...state, workflowCategories: concat(state.workflowCategories, action.data) }

    case OPEN_WF_ACTION_MODAL:
      return { ...state, wfActionModalOpen: true, editWfAction: action.data }

    case CLOSE_WF_ACTION_MODAL:
      return { ...state, wfActionModalOpen: false }

    case FIX_ALL_DEVICE_INCIDENTS:
      return { ...state, incidentDraw: state.incidentDraw + 1 }

    case OPEN_PARAMS_MODAL:
      return { ...state, paramsModalOpen: true, editParams: action.params || [] }
    case CLOSE_PARAMS_MODAL:
      return { ...state, paramsModalOpen: false }

    case OPEN_PARAM_EDIT_MODAL:
      return { ...state, paramEditModalOpen: true, editParam: action.param }
    case CLOSE_PARAM_EDIT_MODAL:
      return { ...state, paramEditModalOpen: false }

    case ADD_PARAM:
      return { ...state, editParams: concat(state.editParams, action.param) }
    case UPDATE_PARAM:
      return { ...state, editParams: state.editParams.map(p => p.key === action.oldParam.key ? action.newParam : p) }
    case REMOVE_PARAM:
      return { ...state, editParams: state.editParams.filter(p => p.key !== action.param.key) }

    case UPDATE_MONITOR_PARAMS:
      return { ...state, monitorParams: action.params }

    case FETCH_GROUP_DEVICES_LINES:
      return { ...state, mapDevices: action.devices, mapLines: action.lines }

    case ADD_GROUP_DEVICE:
      return { ...state, mapDevices: concat(state.mapDevices, action.data) }
    case UPDATE_GROUP_DEVICE:
      return { ...state, mapDevices: state.mapDevices.map(m => m.id === action.data.id ? action.data : m) }
    case REMOVE_GROUP_DEVICE:
      return { ...state, mapDevices: state.mapDevices.filter(m => m.id !== action.data.id) }

    case ADD_GROUP_LINE:
      return { ...state, mapLines: concat(state.mapLines, action.data) }
    case UPDATE_GROUP_LINE:
      return { ...state, mapLines: state.mapLines.map(m => m.id === action.data.id ? action.data : m) }
    case REMOVE_GROUP_LINE:
      return { ...state, mapLines: state.mapLines.filter(m => m.id !== action.data.id) }

    case OPEN_SYS_WORKFLOWS_MODAL:
      return { ...state, sysWorkflowsModalOpen: true, selectedSysWorkflows: [], selectedSysWorkflowCategory: '' }

    case CLOSE_SYS_WORKFLOWS_MODAL:
      return { ...state, sysWorkflowsModalOpen: false }

    case SELECT_SYS_WORKFLOW:
      return { ...state, selectedSysWorkflows: concat(state.selectedSysWorkflows, action.workflow) }
    case DESELECT_SYS_WORKFLOW:
      return { ...state, selectedSysWorkflows: state.selectedSysWorkflows.filter(u => u.id !== action.workflow.id) }

    case SELECT_SYS_WORKFLOW_CATEGORY:
      return { ...state, selectedSysWorkflowCategory: action.category }
    case FETCH_MONITOR_OS:
      return { ...state, monitorOS: action.os }
    case FETCH_MONITOR_DISK:
      return { ...state, monitorDisk: action.disk }
    case FETCH_MONITOR_CPU:
      return { ...state, monitorCpu: action.cpu }
    case FETCH_MONITOR_MEMORY:
      return { ...state, monitorMemory: action.memory }
    case CLEAR_MONITORS:
      return { ...state, monitorCpu: null, monitorDisk: null, monitorOS: null, monitorMemory: null }
  }
  return state
}
