import React from 'react'
import {Paper} from 'material-ui'
import { concat, assign, isEqual, keys, debounce, chunk, reverse, merge, isArray } from 'lodash'
import $ from 'jquery'
import moment from 'moment'

import { encodeUrlParams, dateFormat } from 'shared/Global'
import { ROOT_URL } from 'actions/config'

import {paperZDepth} from 'style/common/materialStyles'

export default class LogPapers extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentPage: -1,
      isLoading: false,
      maxPages: 0,
      results: [],
      total: 0,
      hasMore: true,

      selected: []
    }
    this.lastRequest = null

    this.loadMoreDeb = debounce(this.loadMore.bind(this), 200)
  }

  getHighlighted (entity, highlights) {
    let data = merge({}, entity)
    keys(highlights).forEach(path => {
      const highlighted = highlights[path]
      const pathElements = path.split('.')

      let el = data
      pathElements.forEach((pathEl, index) => {
        if (index === pathElements.length - 1) {
          if (isArray(el[pathEl])) {
            el = el[pathEl]
            el.forEach((item, index) => {
              if (highlighted.match(item)) el[index] = highlighted
            })
          } else {
            el[pathEl] = highlighted
          }
        } else {
          el = el[pathEl]
          if (isArray(el)) el = el[0]
        }
      })
    })

    return data
  }

  componentWillMount () {
    const {onUpdateCount} = this.props
    onUpdateCount && onUpdateCount(0, [], true)
  }

  componentDidUpdate (prevProps, prevState) {
    const {url, params, handleRecord} = this.props
    if (url !== prevProps.url || !isEqual(params, prevProps.params) ||
      (prevProps.handleRecord && !handleRecord) || (!prevProps.handleRecord && handleRecord)) {
      this.refresh()
    }
  }

  componentWillUnmount () {
    if (this.lastRequest) {
      this.lastRequest.abort()
      this.lastRequest = null
    }
  }

  getCurrentData () {
    return this.props.useExternal ? this.state.results : this.props.data
  }

  getExternalData (page, clear) {
    if (this.state.isLoading) {
      if (clear) {
        if (this.state.results.length) this.setState({results: []})
      }
      return
    }

    const {url, params, pageSize, onUpdateCount, handleRecord} = this.props
    if (!url) return
    page = clear ? 1 : (page || 1)
    let urlParams = assign({
      page: page - 1,
      size: pageSize || 10
    }, params)

    this.setState({
      isLoading: true
    })

    if (this.lastRequest) {
      this.lastRequest.abort()
    }

    this.lastRequest = $.get(`${ROOT_URL}${url}?${encodeUrlParams(urlParams)}`).done(res => {
      const embedded = res._embedded
      let data = embedded[keys(embedded)[0]]

      data = data.map(d => ({
        ...d,
        entity: this.getHighlighted(d.entity, d.highlights)
      }))
      if (handleRecord) {
        data = data.map(d => handleRecord(d))
      }

      if (this.props.revertRows) data = reverse(data)

      const total = res.page.totalElements
      let state = {
        results: concat((clear ? [] : this.state.results), data),
        currentPage: page - 1,
        maxPages: res.page.totalPages,
        total,
        isLoading: false,
        hasMore: data.length > 0
      }

      this.setState(state)
      onUpdateCount && onUpdateCount(total, state.results)
    })

    return this.lastRequest
  }

  refresh () {
    if (this.props.useExternal) {
      this.setState({
        hasMore: true
      })
      this.getExternalData(1, true)
    }
  }

  loadMore () {
    if (!this.state.hasMore) return
    this.getExternalData(this.state.currentPage + 2)
  }

  getBodyHeight () {
    const height = parseInt(this.props.bodyHeight || '0', 10)
    return height ? `${height}px` : height
  }

  getFileName(entity) {
    return entity && entity.dataobj ? entity.dataobj.file : ''
  }
  renderTable () {
    const {pageSize} = this.props

    const results = this.getCurrentData()

    const chunks = chunk(results, pageSize)
    return chunks.map((list, i) => {
      let title, timeFrom, timeTo
      if (list.length) {
        title = this.getFileName(list[0].entity) || this.getFileName(list[list.length - 1].entity)
        timeFrom = moment(list[0].entity.timestamp).format(dateFormat)
        timeTo = moment(list[list.length - 1].entity.timestamp).format(dateFormat)
      }
      return (
        <div key={i} className="padding-sm margin-md-bottom">
          <Paper zDepth={paperZDepth}>
            <div className="header-red">{title} : {timeFrom} ~ {timeTo}</div>
            {list.map(row =>
              <div key={row.id} className="padding-xs" dangerouslySetInnerHTML={{__html: row.entity && row.entity.dataobj ? row.entity.dataobj.line : ' '}}/>
            )}
          </Paper>
        </div>
      )
    })
  }

  renderPaging () {
    const {maxPages} = this.state
    const btns = []
    for (var i = 0; i < maxPages; i++) {
      btns.push(
        <div key={i} className="btn btn-default link inline-block">{i + 1}</div>
      )
    }
    return (
      <div>
        {btns}
      </div>
    )
  }

  render () {
    const table = this.renderTable()
    if (!this.props.bodyHeight) {
      return (
        <div className="flex-vertical" style={{height: '100%', overflow: 'auto'}}>
          {this.renderPaging()}
          <div className="flex-1">
            {table}
          </div>
        </div>
      )
    }
    return table
  }

  // render () {
  //   const table = this.renderTable()
  //   if (!this.props.bodyHeight) {
  //     return (
  //       <ReduxInfiniteScroll
  //         children={table}
  //         loadMore={this.loadMoreDeb}
  //         loadingMore={this.state.isLoading}
  //       />
  //     )
  //   }
  //   return table
  // }
}

LogPapers.defaultProps = {
  id: null,
  url: '',
  params: null,
  cells: [],
  useExternal: true,
  data: [],

  pageSize: 20,
  revertRows: false,

  onUpdateCount: null,
  handleRecord: null
}
