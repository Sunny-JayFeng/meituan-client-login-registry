import axios from 'axios'
export default {
  async uploadFile (form) {
    return axios.create({
    })({
      method: 'POST',
      url: 'http://127.0.0.1:20002/meituan/user/uploadFile',
      data: form
    })
  }
}
