'use strict'

const fs = require('fs')
const path = require('path')

const generator = {
  async run() {
    const migrationTplPath = path.join(process.cwd(), 'app/migration')
    const tpl = fs.readFileSync(path.join(migrationTplPath, '.tpl.js'), 'utf-8')
    const timestamp = new Date().getTime()
    const migrationName = timestamp
    const migrationFileContent = tpl
      .replace('{{name}}', migrationName)
      .replace('{{timestamp}}', timestamp)
    const filename = `${timestamp}_migration.js`
    fs.writeFileSync(path.join(migrationTplPath, filename), migrationFileContent)
  }
}

generator.run().then(res => {
  console.log('-----> create migration done')
  process.exit()
}).catch(error => {
  console.error('-----> create migration error: ')
  console.log(error)
})
