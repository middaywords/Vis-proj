import Koa from 'koa'
import bodyParser from 'koa-bodyparser' // 上下文解析
import helmet from 'koa-helmet' // 安全支持
import respond from 'koa-respond'
import compress from 'koa-compress'
import logger from 'koa-logger' // logger中间件
import serve from 'koa-static' // 静态资源服务
import cors from 'koa-cors' // 跨域访问中间件
import Router from 'koa-router' // 路由中间件
import path from 'path' // 路径管理
import Boom from 'boom' // 错误管理
import RouterConfig from './router' 

const app = new Koa()
const router = new Router()
const port = process.env.PORT || 3033

RouterConfig(router)

app
  .use(cors()) // cors中间件必须放在router前面
  .use(bodyParser())
  .use(helmet())
  .use(respond())
  .use(compress())
  .use(logger())
  .use(router.routes())
  .use(router.allowedMethods({
      throw: true,
      notImplemented: () => new Boom.notImplemented(),
      methodNotAllowed: () => new Boom.methodNotAllowed()
  }))
  .use(serve(path.join(process.cwd(), '../front/')))
  .listen(port, () => {
    console.log(`Running at http://localhost:${port}`)
  })
