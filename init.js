'use strict'

const fs = require('fs')
const path = require('path')

if (!process.env._HAS_LOAD_ENV_
    && (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV)
) {
  const baseDir = process.cwd()
  const envPath = path.resolve(baseDir, './.env.dev')

  if (fs.existsSync(envPath)) {
    require('dotenv-safe').config({
      allowEmptyValues: true,
      path: envPath
    })
    process.env.__HAS_LOAD_ENV__ = true // 只加载一次
  } else {
    console.warn('-----warn-------')
    console.warn(`not fount env file ${envPath}, optional to add`)
    console.warn('----------------')
  }
}
