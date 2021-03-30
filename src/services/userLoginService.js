import { request } from '@/util/request'

export default {

  /**
   * 通过验证码登录
   * @param params
   * @returns {Promise<*>}
   */
  async loginByIdentifyCode (params) {
    return request({
      method: 'POST',
      url: '/loginByCode',
      data: params
    })
  },

  /**
   * 通过密码登录
   * @param params
   * @returns {Promise<*>}
   */
  async loginByPassword (params) {
    return request({
      method: 'POST',
      url: '/loginByPassword',
      data: params
    })
  }
}
