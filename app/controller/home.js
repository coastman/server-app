'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this
    const list = await app.Models.Article.findAll()
    console.log(list)
    ctx.body = 'hi, egg'
  }
}

module.exports = HomeController
