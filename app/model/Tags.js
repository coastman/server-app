'use strict'

module.exports = (sequelize, { STRING, INTEGER, DATE, TEXT }) => {
  const Tags = sequelize.define('tags', {
    name: {
      type: STRING(50),
      allowNull: false,
      unique: true,
      defaultValue: '',
      comment: '标签名称'
    },
    desc: {
      type: STRING,
      allowNull: false,
      defaultValue: '',
      comment: '标签描述'
    },
    // 扩展字段方便扩展字段
    extra: {
      type: STRING(2000),
      defaultValue: '{}',
      comment: '冗余字段，额外信息（设计容纳 20 个字段）',
      get() {
        return this.getJsonValue('extra');
      },
      set(value) {
        this.setJsonValue('extra', value); // limit 600 items
      }
    }
  }, {
    freezeTableName: true
  })

  return Tags
}
