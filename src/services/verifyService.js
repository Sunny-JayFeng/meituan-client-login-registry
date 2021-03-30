import { request } from '@/util/request'

export default {

  /**
   * 二次校验
   * @param phone
   * @param identifyCode
   * @returns {Promise<*>}
   */
  async verifyCheckIdentifyCode (params) {
    return request({
      method: 'POST',
      url: '/verifyCheckIdentifyCode',
      data: params
    })
  },

  /**
   * 判断号码是否存在 ticket
   * @param phone
   * @returns {Promise<*>}
   */
  async checkExistsTicket (phone) {
    return request({
      method: 'POST',
      url: '/checkExistsTicket/' + phone,
      data: null
    })
  }
}
