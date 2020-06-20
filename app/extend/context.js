'use strict'

module.exports = {
  success(result = {}, msg, extra = {}) {
    const ctx = this
    ctx.status = 200
    const resp = Object.assign(extra, {
      code: 200,
      result: result || {},
      msg: msg || 'success'
    })

    ctx.body = resp
    return resp
  },

  error(code, msg = '', result = {}) {
    const ctx = this
    const resp = {
      code,
      result: result || {},
      msg
    }
    ctx.body = resp
    return resp
  }
}
