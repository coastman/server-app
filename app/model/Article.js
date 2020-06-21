'use strict'

module.exports = (sequelize, { STRING, INTEGER, DATE, TEXT }) => {
  const Article = sequelize.define('article', {
    name: {
      type: STRING(50),
      allowNull: false,
      unique: true,
      defaultValue: '',
      comment: '文章名称'
    },
    desc: {
      type: STRING,
      allowNull: false,
      defaultValue: '',
      comment: '文章描述'
    },
    type: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '类型'
    },
    // tags: {
    //   type: STRING,
    //   allowNull: false,
    //   defaultValue: '[]',
    //   get() {
    //     return this.getJsonValue('tags')
    //   },
    //   set(value) {
    //     this.setJsonValue('tags', value)
    //   },
    //   comment: '文章标签'
    // },
    content: {
      type: TEXT('medium'),
      allowNull: false,
      // BLOB/TEXT column can't have a default value
      // defaultValue: '',
      comment: '内容'
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
    },
  }, {
    freezeTableName: true
  })

  return Article
}
