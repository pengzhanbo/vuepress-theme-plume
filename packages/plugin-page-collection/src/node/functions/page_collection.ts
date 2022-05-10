import type { Handler } from '@netlify/functions'
import * as lean from 'leancloud-storage'

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

const response = (
  code: number,
  message: string,
  data?: Record<string, any>
): ResponseRes => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      code,
      result: data || '',
      message,
    }),
  }
}

const successRes = (data: Record<string, any>): ResponseRes => {
  return response(200, 'success', data)
}

const errorRes = (message: string, code = 500): ResponseRes => {
  return response(code, message)
}

export const handler: Handler = async (event, context) => {
  const { url } = JSON.parse(event.body || '') || {}
  if (!url) {
    return errorRes('params [url] not found')
  }

  const query = new lean.Query('Page')
  const Page = lean.Object.extend('Page')
  try {
    query.equalTo('url', url)
    let current = await query.first()
    if (current) {
      current.set('visitCount', current.get('visitCount') + 1)
    } else {
      current = new Page()
      current.set('url', url)
      current.increment('visitCount', 1)
    }
    current = await current.save()
    return successRes({
      visitCount: current.get('visitCount'),
    })
  } catch (e: any) {
    return errorRes(e.message, e.code || e.status || e.statusCode)
  }
}
