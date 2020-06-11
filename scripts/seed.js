'use strict'

require(`${process.cwd()}/init`)
const inquirer = require('inquirer')
const dbHelper = require(`${process.cwd()}/app/extend/database`)
const modelsFactory = require(`${process.cwd()}/app/model`)

const sqldb = {
  async run() {
    const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    const promptList = [
      {
        type: 'input',
        message: '请输入要初始化的数据库：',
        name: 'busId',
        default: '',
        when: () => {
          return isDev
        },
      },
    ]
    const { busId } = await inquirer.prompt(promptList)
    const dbName = dbHelper.getDatabaseName(busId)
    await dbHelper.createDatabase(dbName)

    const config = {
      DB_NAME: dbName || process.env.DB_NAME,
      DB_HOST: process.env.DB_HOST || '127.0.0.1',
      DB_USERNAME: process.env.DB_USERNAME || 'root',
      DB_PASSWORD: process.env.DB_PASSWORD || '123456'
    }
    const sequelize = await dbHelper.createSqlConnection(config, {
      logging: false
    })

    const models = await modelsFactory(sequelize, sequelize.DataTypes)
    for (const key of Object.keys(models)) {
      const model = models[key]
      if (!model.sync) continue

      try {
        await model.sync()
      } catch (error) {
        console.log(error)
        const errMsg = `------> sync table ${key} failure, maybe exist.`
        console.error(errMsg)
      }
    }
    sequelize.close()
  }
}

return sqldb.run().then(res => {
  console.log('<----- run db seed done')
  process.exit()
}).catch(error => {
  console.error('<----- run db seed error: ')
  console.log(error)
})

