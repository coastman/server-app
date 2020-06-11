'use strict'

require('./init')
const dbHelper = require('./app/extend/database')
const modelsFactory = require(`${process.cwd()}/app/model`)

module.exports = async app => {
  app.beforeStart(async () => {
    const sequelize = await dbHelper.createSqlConnection({
      DB_NAME: process.env.DB_NAME || 'p666666',
      DB_HOST: process.env.DB_HOST || '127.0.0.1',
      DB_USERNAME: process.env.DB_USERNAME || 'root',
      DB_PASSWORD: process.env.DB_PASSWORD || '123456'
    })
    const Models = await modelsFactory(sequelize, sequelize.DataTypes)
    app.Models = Models
  })
}
