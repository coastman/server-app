'use strict'

/**
 * extend instance
 * 扩展 sequelize 实例
 */

module.exports = sequelize => {
  // 为了避免 在 utf8mb4 字符下，索引超长(limit 768)，默认长度从 255 变为 190
  const STRING = sequelize.DataTypes.STRING
  sequelize.DataTypes.STRING = function(length = 190, binary) {
    return new STRING(length, binary)
  }

  // ======= 重写 define 方法, 以扩展 model
  const rawDefine = sequelize.define
  sequelize.rawDefine = rawDefine
  sequelize.define = (name, attributes, options) => {
    const model = rawDefine.call(sequelize, name, attributes, Object.assign({
      freezeTableName: true // 不修改表名为复数
    }, options))

    // ===== 重载 model.sync 方法，原生的方法不能满足需求
    // const rawSync = model.sync;
    // model.sync = async (...args) => {
    //   const hooks = model.options.hooks;
    //   try {
    //     const afterSync = hooks.afterSync;
    //     delete hooks.afterSync;

    //     await rawSync.call(model, ...args); // call raw model.sync()
    //     if (afterSync && typeof afterSync[0] === 'function') {
    //       model.options.hooks.afterSync = afterSync;
    //       await afterSync[0].call(model, model);
    //     }
    //   } catch (ex) {
    //     throw ex; // 抛出错误
    //   }
    // };

    // ===== 每个实例，都可以调用的方法
    model.prototype.getParseData = function() {
      const parseData = {}
      Object.keys(this.dataValues).forEach(filed => {
        parseData[filed] = this.get(filed) // 触发 model 中定义的 get, set 方法
      });
      return parseData
    }

    // === 对象与数据库字符串的转换
    model.prototype.getJsonValue = function(filed, _defaultValue) {
      const attrs = this.rawAttributes
      const defaultValue = _defaultValue || attrs[filed].defaultValue || '{}'

      const json = this.getDataValue(filed)
      try {
        return JSON.parse(json || defaultValue)
      } catch (ex) {
        const size = new Buffer(json).length / 1024
        throw new Error(`model ${name}.${filed}: json parse error, size ${size} kb`)
      }
    }

    model.prototype.setJsonValue = function(filed, value, limit) {
      if (Array.isArray(value) && value.length > limit) {
        console.error(`model ${name}.${filed}: outof limit (${value.length}), slice 0 to ${limit}`)
        value = value.slice(0, limit)
      }
      if (typeof value !== 'string') {
        value = JSON.stringify(value)
      }
      this.setDataValue(filed, value)
    }

    return model
  }
}
