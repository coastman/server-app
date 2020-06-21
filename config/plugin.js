'use strict'

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  // 安全插件暂时开启
  security: {
    enable: false
  },

  validate: {
    package: 'egg-validate'
  }
}
