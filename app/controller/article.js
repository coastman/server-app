'use strict'

const Controller = require('egg').Controller

class ArticleController extends Controller {
  async index() {
    const { ctx, app } = this
    const list = await app.Models.Article.findAll()
    ctx.success({ list })
  }

  async create() {
    const { ctx, app } = this
    const params = Object.assign({}, ctx.request.body)
    const paramSchecma = {
      name: { type: 'string', required: true },
      desc: { type: 'string', required: false },
      type: { type: 'number', required: false },
      content: { type: 'string', required: true }
    }
    ctx.validate(paramSchecma, params)
    const isExist = await ctx.helper.validate.isExist({
      type: 'create',
      filed: 'name',
      Model: app.Models.Article,
      value: params.name
    })
    if (isExist) return ctx.error('当前名称文章已存在！')
    const resp = await app.Models.Article.create(params)
    ctx.success(resp)
  }

  async getContent() {
    const { ctx, ctx: { params }, app: { Models } } = this
    const result = await Models.Article.findByPk(params.id)
    ctx.success(result)
  }
}

module.exports = ArticleController
