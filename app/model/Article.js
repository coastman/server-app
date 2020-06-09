'use strict'

module.exports = (sequelize, { STRING, INTEGER, DATE, TEXT }) => {
  const Article = sequelize.define('article', {
    name: {
      type: STRING(50),
      allowNull: false,
      unique: true,
      defaultValue: '',
      comment: '名称',
    },
    desc: {
      type: STRING,
      allowNull: false,
      defaultValue: '',
      comment: '描述',
    },
    type: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '类型',
    },
    content: {
      type: TEXT('medium'),
      comment: '内容',
    },
    extra: {
      type: STRING(2000),
      defaultValue: '{}',
      comment: '冗余字段，额外信息（设计容纳 20 个字段）',
    },
  }, {
    freezeTableName: true,
  })

  return Article
}
