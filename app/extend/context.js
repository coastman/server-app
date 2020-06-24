'use strict'

// ==== ctx 上挂载通用方法
module.exports = {
  success(result = {}, msg, extra = {}) {
    const ctx = this
    ctx.status = 200
    const resp = Object.assign(extra, {
      code: 1,
      result: result || {},
      msg: msg || 'success'
    })

    ctx.body = resp
    return resp
  },

  error(msg = '', code = 0) {
    const ctx = this
    const resp = {
      code,
      msg
    }
    ctx.body = resp
    return resp
  }
}
