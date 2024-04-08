import _axios from 'axios'

const axios = _axios.create()

const UPTIMEBOT_API_KEY = 'ur1658906-d490305f6f6a341ae57bb81b'

const MONITORID = 796705320

export const useUptimeBot = () => {
  const getAppStatus = async () => {
    try {
      const { data: result } = await axios.post(
        'https://cors.status.org.cn/uptimerobot/v2/getMonitors',
        {
          api_key: UPTIMEBOT_API_KEY,
          format: 'json',
          logs: 1,
          log_types: '1-2'
        }
      )
      const monitor = result.monitors.find((monitor: any) => monitor.id === MONITORID)
      if (monitor.status !== 2) {
        return 'service'
      } else {
        return 'browser'
      }
    } catch (error) {
      console.log('请求 UptimeRobot 失败' + error)
      return false
    }
  }

  return { getAppStatus }
}
