import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

function getFromCache (cacheKey: string): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    const cachedResponse = window.localStorage.getItem(cacheKey)
    if (cachedResponse) {
      const response = JSON.parse(cachedResponse)
      resolve(response)
    } else {
      reject(new Error('No cached response found'))
    }
  })
}

function getFromNetworkAndSaveToCache (url: string, config: AxiosRequestConfig, cacheKey = url): Promise<AxiosResponse> {
  return axios.get(url, { ...config, timeout: 20000 })
    .then(response => {
      window.localStorage.setItem(cacheKey, JSON.stringify(response))
      return response
    })
    .catch(error => {
      throw error
    })
}

export function cachedGet (url: string, config: AxiosRequestConfig, { cacheKey, isOnlineFirst } = { cacheKey: url, isOnlineFirst: false }): Promise<AxiosResponse> {
  // Get from cache and resolve if the access token is valid for best online performance
  // as well as offline / lie-fi support, but make the call to the network anyway to update the cache for next visit. if there's nothing in the cache, fallback to the network
  if (isOnlineFirst) {
    // Online first approach
    // Get from network then fallback to cache
    return getFromNetworkAndSaveToCache(url, config, cacheKey)
      .catch(error => {
        if (!error.response && !axios.isCancel(error)) {
          // Network connectivity error
          return getFromCache(cacheKey)
        } else {
          // API returned error
          throw error
        }
      })
  } else {
    // Offline first approach
    // Get from cache first, make the request anyway to update the cache then fallback to network
    return Promise.race([
      getFromCache(cacheKey),
      getFromNetworkAndSaveToCache(url, config, cacheKey)
    ])
      .catch(error => {
        console.warn('error', error)
        if (!error.response) {
          // Network error or Results are not in cache
          return getFromNetworkAndSaveToCache(url, config)
        } else {
        // let the consumer catch and handle the API returned error
          throw error
        }
      })
  }
}
