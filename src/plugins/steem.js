import { Client } from 'dsteem'

export default ({ app, router, Vue }) => {
  const steemClient = new Client('https://api.steemit.com')
  Vue.prototype.$steemClient = steemClient
}
