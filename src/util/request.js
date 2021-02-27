import axios from 'axios'
import { Message } from 'element-ui'

axios.defaults.withCredentials = true // 跨域设置 cookie
const TIME_OUT_MS = 30 * 1000 // 请求超时时间

const service = axios.create({
  baseURL: process.env.DEV_BASE_URL, // 开发环境
  withCredentials: true, // 携带 cookie
  timeout: TIME_OUT_MS // 超时时间
})

service.interceptors.request.use(
  config => {
    config.headers['request-from'] = 'browser' // 标注请求来自浏览器
    return config
  }
)

service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data
    } else {
      Message.error('巴拉巴拉')
    }
  }
)

export function request (requestParamObject) {
  return service({
    method: requestParamObject.method,
    url: requestParamObject.url,
    data: requestParamObject.data
  })
}
