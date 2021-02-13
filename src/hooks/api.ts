import { ref, Ref } from 'vue'
import axios, { AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios'
import { cachedGet } from '../helpers/cached-get'

export interface CacheOptions {
  cacheKey?: string
  isOnlineFirst?: boolean
}

export interface RequestState {
  error: Ref<Error>
  isLoading: Ref<boolean>
  response: Ref<AxiosResponse>
  request: (cacheOptions?: CacheOptions) => Promise<void>
  cancel: () => void
}

export function useApi (url: string, options: AxiosRequestConfig = { method: 'GET' }): RequestState {
  // TODO, maybe make a state object instead of multiple separate refs
  const response = ref()
  const error = ref()
  const isLoading = ref()

  const CancelToken = axios.CancelToken
  let source: CancelTokenSource

  const request = async ({ isOnlineFirst = false, cacheKey = url }: CacheOptions = { cacheKey: url, isOnlineFirst: false }) => {
    if (isLoading.value) {
      console.warn('request already ongoing')
      return
    }
    try {
      source = CancelToken.source()

      error.value = undefined
      isLoading.value = true

      let res: AxiosResponse
      if (options.method === 'GET') {
        res = await cachedGet(url, { ...options, cancelToken: source.token }, { isOnlineFirst, cacheKey })
      } else {
        res = await axios(url, { ...options, cancelToken: source.token })
      }
      response.value = res.data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const cancel = () => {
    source.cancel('Operation canceled by the user')
  }

  return { response, request, error, isLoading, cancel }
}
