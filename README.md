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
  npm run lint   # eslint 校验
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
