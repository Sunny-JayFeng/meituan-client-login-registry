import { request } from '@/util/request'

export default {

  /**
   * 获取验证码
   * @param phone
   * @returns {Promise<*>}
   */
  async getIdentifyCode (phone) {
    return request({
      method: 'GET',
      url: '/getIdentifyCode/' + phone,
      data: null
    })
  }
}
