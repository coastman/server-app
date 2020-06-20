# server-app
> 后端服务, 基于 egg.js, MySQL, Redis


## 安装运行
推荐使用 npm 来进行包安装

```bash
  git clone **.git
  cd server-app
  npm install

  # 环境变量: 可通过本地化配置，设置 私密信息，如 privatKey，或者，个性化的信息 如 端口(port, domain)   
  cp .env.example .env.dev (本地) | .env（生产）

  # 安装并创建 MySQL 数据库，并在 .env.dev 中配置数据库信息（uasername, pwd）, 然后
  npm run db:seed    # 数据库初始化
  npm run db:migrate # 数据库历史变更迁移

  # 启动
  npm run dev    # 开发环境运行
  npm run start  # 生产环境运行
  npm run test   # 执行单元测试
  npm run lint   # Eslint 校验
```

## 常用规范

### 1，提交
```bash
  <type>(<scope>): <subject>
  参考：git commit -m 'fix(view): 修复模板编译错误'
```
type 类型:

* feat：新功能（feature）
* fix：修补bug
* docs：文档（documentation）
* style： 格式（不影响代码运行的变动）
* refactor：重构（即不是新增功能，也不是修改bug的代码变动）
* test：增加测试
* chore：构建过程或辅助工具的变动

## 参考文档
* [egg 官方文档](https://eggjs.org/zh-cn/intro/quickstart.html) 核心框架

* [Git Commit 规范](https://segmentfault.com/a/1190000009048911)

* [Sequelize 文档](https://itbilu.com/nodejs/npm/VkYIaRPz-.html) 基于 NodeJs 的 MySQL ORM 框架

## 目录结构
```
server-app/
   |
   ├──app/                       * 主程序入口目录
   │   │
   │   │──controller             * 控制器目录
   │   │
   │   │──extend                 * 框架扩展目录
   │   │
   │   │──migrate                * 数据库迁移脚本目录
   │   │
   │   │──model                  * model 文件目录
   │   │
   │   │──public                 * 静态资源目录
   │   │
   │   │──service                * service 服务目录
   │   │
   │   └──router                 * 路由文件
   │
   │──config/                    * 配置文件目录
   │
   │──scripts/                   * 构建脚本目录
   │
   │──test/                      * 单元测试目录
   │
   │──.env.example               * 环境变量示例文件
   |
   │──.eslintrc                  * Eslint 配置
   │
   │──.gitignore                 * Git忽略文件配置
   |
   ├──app.js                     * 程序初始化文件
   │
   │──CHANGELOG.md               * 版本更新记录
   │
   │──init.js                    * 环境变量加载文件
   │
   └──package.json               * 依赖信息
```
