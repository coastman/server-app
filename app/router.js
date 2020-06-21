'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  router.get('/api/v1/article/all', controller.article.index)
  router.post('/api/v1/article', controller.article.create)
  router.get('/api/v1/article/:id', controller.article.getContent)
}
