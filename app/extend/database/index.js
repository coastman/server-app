'use strict'

const Sequelize = require('sequelize')

const dbHelper = {
  getDatabaseName(bId) {
    return bId ? `p${bId}` : 'p111222'
  },

  async createDatabase(dbName, options) {
    const config = Object.assign({
      DB_NAME: '', // 置空
      DB_HOST: process.env.DB_HOST || '127.0.0.1',
      DB_USERNAME: process.env.DB_USERNAME || 'root',
      DB_PASSWORD: process.env.DB_PASSWORD || '123456'
    }, options)

    const sequelize = await dbHelper.createSqlConnection(config)
    return await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${dbName} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`)
  },

  async createSqlConnection(config = {}, options = {}) {
    const dbOptions = Object.assign({
      host: config.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || config.DB_PORT || 3306),
      logging: true,
      dialect: config.DB_TYPE || 'mysql',
      freezeTableName: true,
      define: {
        charset: 'utf8mb4', // 1个字节 4 位，可存储表情 unicode 字符
        collate: 'utf8mb4_unicode_ci',
      },
      pool: {
        max: process.env.DB_POOL_MAX || 50,
        min: process.env.DB_POOL_MIN || 0, // 连接池最小连接数, 保持一些链接，有利于应对一些突发流量, 但是也会持续的占用连接
        acquire: process.env.DB_POOL_ACQUIRE || 30000, // 建立连接出错的时候，在抛出错误之前，池子会尝试建立连接的最大时间
        idle: process.env.DB_POOL_IDLE || 10000, // 闲置的连接超过多少毫秒被释放
      },
      timezone: process.env.DB_TIME_ZONE || '+08:00', // 时区设置，兼容之前的时间是+00:00时区，正确时区为+08:00
    }, options)

    const sequelize = new Sequelize(
      config.DB_NAME,
      config.DB_USERNAME,
      config.DB_PASSWORD,
      dbOptions
    )

    sequelize.DataTypes = Sequelize.DataTypes
    // ===== 验证是否链接成功
    try {
      await sequelize.authenticate()
      sequelize.isConnectSuccess = true
      console.log(`--------> connect sql db success: ${config.DB_NAME}`)
    } catch (ex) {
      sequelize.isConnectSuccess = false
      console.error(`--------> connect sql db failure: ${config.DB_NAME}`)
      console.error(ex.message)
    }

    return sequelize
  }
}

module.exports = dbHelper
