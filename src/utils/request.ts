import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

class Request {
  readonly instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: 'https://api.etherscan.io/',
      timeout: 3000,
    })
    this._initInstance()
  }

  private _initInstance() {
    this.instance.interceptors.request.use(
      (value: AxiosRequestConfig) => {
        return value
      },
      (error: any) => {
        return Promise.reject('Request Error.')
      }
    )

    this.instance.interceptors.response.use(
      (value: AxiosResponse) => {
        if (value.status !== 200) return Promise.reject('Response Error.')
        return value
      },
      (error: any) => {
        return Promise.reject('Network Error.')
      }
    )
  }

  public get(url: string, config?: AxiosRequestConfig<any> | undefined) {
    return this.instance.get(url, config)
  }

  public post(
    url: string,
    data?: any,
    config?: AxiosRequestConfig<any> | undefined
  ) {
    return this.instance.post(url, data, config)
  }
}

export default Request
