'use strict'

module.exports = {
  success(data = {}, msg, extra = {}) {
    const ctx = this
    ctx.status = 200
    const resp = Object.assign(extra, {
      code: 200,
      data: data || {},
      msg: msg || 'success'
    })

    ctx.body = resp
    return resp
  },

  error(code, msg = '', data = {}) {
    const ctx = this
    const resp = {
      code,
      data: data || {},
      msg
    }
    ctx.body = resp
    return resp
  }
}
