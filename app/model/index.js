'use strict'

const ModlesFactory = {
  Article: require('./Article')
}

/**
 * 创建Model实例的工厂函数
 * @param { Instance } sequelize 建立连接成功的sequelize实例
 * @param { Instance } DataTypes 自定义改写过的sequelize的支持数据格式
 */
module.exports = (sequelize, DataTypes) => {
  const Models = {}

  Object.keys(ModlesFactory).forEach(name => {
    const model = ModlesFactory[name](sequelize, DataTypes)
    Models[name] = model
  })

  sequelize.BusModels = Models

  return Models
}
