'use strict'

require(`${process.cwd()}/init`)
const path = require('path')
const fs = require('fs')
const processArgs = require('args')
const inquirer = require('inquirer')
const modelsFactory = require(`${process.cwd()}/app/model`)
const dbHelper = require(`${process.cwd()}/app/extend/database`)

/**
 * action: do(执行脚本迁移), undo(脚本回滚), 默认执行脚本迁移
 * executeMode: recent(执行最近的迁移脚本), all(执行所有未被执行的脚本) 默认执行最近的
 * 注: 回退脚本只会执行单个，无法执行多个
 */

processArgs
  .option('action', '操作 do or undo, default is do', 'do')
  .option('executeMode', 'recent: 仅执行最近的迁移（默认），all: 执行所有未被执行的迁移', 'recent')
const flags = processArgs.parse(process.argv)
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

const sqldb = {
  async run() {
    const promptList = [
      {
        type: 'input',
        message: '指定回滚的脚本名称(脚本名称比如:1551855272781，默认最新的脚本):',
        name: 'execMigrate',
        default: '',
        when: () => {
          return flags.action === 'undo';
        }
      },
      // dev 环境下提供选取数据库进行迁移
      {
        type: 'input',
        message: '指定需要变更的数据库，填写数据库ID：',
        name: 'busId',
        default: '',
        when: () => {
          return isDev
        }
      }
    ]
    // 1. 获取命令行填写的数据
    const { busId, execMigrate } = await inquirer.prompt(promptList)
    // 2. 连接数据库, 获取所有的模型
    const dbName = dbHelper.getDatabaseName(busId)
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
    // 3. 开始数据迁移
    await sqldb.migration(sequelize, models, { execMigrate })
    sequelize.close(); // 释放连接
  },

  async migration(sequelize, models, extra = {}) {
    const DataTypes = sequelize.DataTypes
    // 1. 获取迁移的模型(存放迁移的脚本信息)
    const metaModel = await sqldb.getMetaModel(sequelize)
    const metaQuery = {
      order: [[ 'name', 'DESC' ]] // 按降序排列迁移，最新执行的在前面
    }
    let allMetaList = await metaModel.findAll(metaQuery)
    // 2. 获取数据表记录的最近的迁移脚本
    const latestMeta = allMetaList[0] || await metaModel.findOne(metaQuery)

    const queryInterface = sequelize.getQueryInterface()
    const sqldbInterface = sqldb.getSqlDBInterface(queryInterface) // 扩展接口
    sqldbInterface.queryInterface = queryInterface
    sqldbInterface.Models = models
    sqldbInterface.sequelize = sequelize
    const latestTimestap = latestMeta ? latestMeta.name.split('_')[0] : 0
    // 3. 获取当前所有的迁移文件, 用于和数据库中的比对出未执行的
    let migarationFiles = sqldb.getMigrationFiles()
    if (extra.execMigrate) {
      // 4. 如果指定了回滚脚本，重新赋值数据库记录和本地文件记录
      allMetaList = [ allMetaList.find(item => item.name.split('_')[0] === extra.execMigrate) ]
      migarationFiles = [ migarationFiles.find(item => item.filename.split('_')[0] === extra.execMigrate) ]
      if (!allMetaList[0] || !migarationFiles[0]) {
        console.error(`<----- could not found migrate file or record ${extra.execMigrate}_migration.js`)
        return
      }
    }
    // 执行相应的脚本
    for (const file of migarationFiles) {
      const filename = file.filename
      if (!/(.js)$/.test(filename)) continue // 必须以 js 结尾

      const migaration = require(path.join(file.baseDir, filename))
      if (flags.action === 'undo') {
        // 回滚
        await sqldb.rollback(filename, migaration, {
          sqldbInterface, DataTypes, metaModel, latestMeta
        });
      } else {
        // 迁移
        await sqldb.forward(filename, latestTimestap, migaration, {
          sqldbInterface, DataTypes, metaModel, allMetaList, ...extra
        })
      }
      // 同步数据库记录和当前记录
      await sqldb.syncFileAndDatabaseMap(migarationFiles, allMetaList)
    }
  },

  async getMetaModel(sequelize) {
    const metaModel = sequelize.define('_migaration_meta', {
      name: {
        type: sequelize.DataTypes.STRING(190),
        allowNull: false,
        unique: true,
        defaultValue: '',
        comment: '已执行的数据迁移名称'
      }
    })
    await metaModel.sync() // 同步到数据库
    return metaModel
  },

  getSqlDBInterface(queryInterface) {
    return {
      async addColumn(...args) {
        try {
          await queryInterface.addColumn(...args);
          console.log(`------>success add column {${args[1]}} to [${args[0]}]: `);
        } catch (err) {
          console.log(`------>faild add column {${args[1]}} to [${args[0]}]: ` + err.message);
        }
      },
      async removeColumn(...args) {
        try {
          await queryInterface.removeColumn(...args);
          console.log(`------>success remove column {${args[1]}} from [${args[0]}]: `);
        } catch (err) {
          console.log(`------>faild remove column {${args[1]}} from [${args[0]}]: ` + err.message);
        }
      },
      async changeColumn(...args) {
        try {
          await queryInterface.changeColumn(...args);
          console.log(`------>success change column {${args[1]}} in [${args[0]}]: `);
        } catch (err) {
          console.log(`------>faild change column {${args[1]}} in [${args[0]}]: ` + err.message);
        }
      },
      async renameColumn(...args) { // (tableName: String, attrNameBefore: String, attrNameAfter: String, options: Object)
        try {
          await queryInterface.renameColumn(...args);
          console.log(`------>success rename column {${args[1]}} in [${args[0]}]: `);
        } catch (err) {
          console.log(`------>faild rename column {${args[1]}} in [${args[0]}]: ` + err.message);
        }
      },
      async addConstraint(...args) {
        try {
          await queryInterface.addConstraint(...args);
          console.log(`------>success add constraint {${args[1]}} to [${args[0]}]: `);
        } catch (err) {
          console.log(`------>faild add constraint {${args[1]}} to [${args[0]}]: ` + err.message);
        }
      },
      async removeConstraint(...args) {
        try {
          await queryInterface.removeConstraint(...args);
          console.log(`------>success remove constraint {${args[1]}} from [${args[0]}]: `);
        } catch (err) {
          console.log(`------>faild remove constraint {${args[1]}} from [${args[0]}]: ` + err.message);
        }
      },
      async removeIndex(...args) {
        try {
          await queryInterface.removeIndex(...args);
          console.log(`------>success remove index {${args[1]}} from [${args[0]}]: `);
        } catch (err) {
          console.log(`------>faild remove index {${args[1]}} from [${args[0]}]: ` + err.message);
        }
      }
    }
  },

  getMigrationFiles() {
    const appMigratePath = path.join(process.cwd(), 'app/migration')
    const migarationFiles = (fs.readdirSync(appMigratePath) || [])
      .filter(filename => filename.includes('.js') && !filename.includes('.tpl'))
      .map(filename => {
        return { filename, baseDir: appMigratePath }
      })

    return migarationFiles
  },

  async forward(filename, latestTimestap, migaration, extra) {
    const { sqldbInterface, DataTypes, metaModel, allMetaList } = extra
    const timestamp = filename.split('_')[0]
    const shouldExecute = timestamp > latestTimestap

    if (shouldExecute) {
      console.log(`==> run migaration ${filename}`)
      try {
        if (migaration.up && flags.action === 'do') {
          await migaration.up(sqldbInterface, DataTypes)
          await metaModel.create({ name: filename }); // 记录一次成功的变更
        }
      } catch (err) {
        console.error(`<----- run migaration ${filename} faild: ` + err.message)
        console.log(err)
      }
      return
    }
    console.log(`==> migaration ${filename} has excuted (已执行).`)
  },

  async rollback(filename, migaration, extra) {
    const { sqldbInterface, DataTypes, metaModel, latestMeta, execMigrate } = extra
    if (latestMeta.name === filename && migaration.down) {
      console.log(`==> rollback migaration ${filename}`)

      await migaration.down(sqldbInterface, DataTypes)
      await metaModel.destroy({ where: { name: latestMeta.name } }) // 删除最近一次变更
      console.log(`<== rollback migaration ${filename} success`)
    }
  },

  async syncFileAndDatabaseMap(migarationFiles, allMetaList) {
    allMetaList.forEach(metaModel => {
      const isMigrateExisit = migarationFiles.find(file => file.filename === metaModel.name)
      if (!isMigrateExisit) {
        console.log(`==> 删除 migaration meta ${metaModel.name}`)
        metaModel.destroy()
      }
    })
  }
}

sqldb.run().then(() => {
  console.log('-----> run db migaration done');
  process.exit()
}).catch(error => {
  console.error('-----> run db migaration error: ', error)
})
