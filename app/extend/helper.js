'use strict'

// ====== helper 通用方法
module.exports = {
  validate: {
    async isExist({ type = 'create', filed, value, Model }) {
      const count = await Model.count({
        where: { [filed]: value }
      })

      if (type === 'create') {
        if (count) return true
        return false
      }

      if (type === 'update') {
        if (count > 1) return true
        return false
      }

      throw new Error('params Validation error')
    }
  }
}
