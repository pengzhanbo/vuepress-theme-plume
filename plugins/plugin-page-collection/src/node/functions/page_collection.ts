/**
 * functions 文件。
 * 页面发起请求时，是以 文件名作为 接口的，
 * 如 当前文件名为 page_collection,
 * 那么客户端发起的请求接口应该是 {host}:{port}/{proxyPrefix}/page_collection
 */
// 引入这个包来提供类型支持
import process from 'node:process'
import type { Handler } from '@netlify/functions'
import * as lean from 'leancloud-storage'

// 通过环境变量来获取 鉴权信息
// 具体的配置，在开发环境中应该写在项目根目录的 `.env` 文件中
// 在生产环境中应该在 netlify 控制台中 配置 环境变量
// 同时，需要在插件的说明文档中 说明需要配置哪些 变量
lean.init({
  appId: process.env.LEAN_CLOUD_APP_ID || '',
  appKey: process.env.LEAN_CLOUD_APP_KEY || '',
  masterKey: process.env.LEAN_CLOUD_MASTER_KEY || '',
})

interface ResponseRes {
  statusCode: number
  body?: string
  message?: string
}

function response(code: number, message: string, data?: Record<string, any>): ResponseRes {
  return {
    statusCode: 200,
    body: JSON.stringify({
      code,
      result: data || '',
      message,
    }),
  }
}

function successRes(data: Record<string, any>): ResponseRes {
  return response(200, 'success', data)
}

function errorRes(message: string, code = 500): ResponseRes {
  return response(code, message)
}

// 主要是为了 在 leancloud 中获取 所有权限，便于操作
// 我在 leancloud 控制台中配置的安全策略，默认是所有用户不可读写
// 所以需要在 functions 中用这种方式来获取权限。
const useMasterKey = Boolean(process.env.LEAN_CLOUD_MASTER_KEY)

// netlify functions 的 functions 格式规范
// 通过导出一个 handler 函数作为 钩子
// event 中包含了 请求相关的信息，你可以通过 console.log(event) 查看具体信息
export const handler: Handler = async (event) => {
  // body 即为 请求体
  const { url } = JSON.parse(event.body || '') || {}
  if (!url)
    return errorRes('params [url] not found')

  // 出于安全考虑，你可能还需要在这里做 域名请求白名单的校验
  // 可以在 event.headers 中拿到相关 域名信息

  // leancloud 相关这里就不解释了
  const query = new lean.Query('Page')
  const Page = lean.Object.extend('Page')
  try {
    query.equalTo('url', url)
    const current = await query.first({ useMasterKey })
    let page: lean.Object
    if (current)
      page = lean.Object.createWithoutData('Page', current.get('objectId'))

    else
      page = new Page()

    page.increment('visitCount', 1)
    page = await page.save(null, {
      useMasterKey,
      fetchWhenSave: true,
    })
    return successRes({
      visitCount: page.get('visitCount'),
    })
  }
  catch (e: any) {
    return errorRes(e.message, e.code || e.status || e.statusCode)
  }
}
