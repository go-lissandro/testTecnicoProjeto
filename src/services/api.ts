import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from '@/types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://api.ondafinance.mock'

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})


apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokenKey = '__onda_access_token__'
    const token = sessionStorage.getItem(tokenKey)

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.headers) {
      config.headers['X-Request-ID'] = crypto.randomUUID()
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const status = error.response?.status

    if (status === 401) {
      sessionStorage.removeItem('__onda_access_token__')
      window.dispatchEvent(new CustomEvent('onda:auth:expired'))
    }

    if (status === 429) {
      const retryAfter = error.response?.headers['retry-after']
      console.warn(`Rate limited. Retry after: ${retryAfter}s`)
    }

    const apiError: ApiError = {
      message: error.response?.data?.message ?? 'Erro inesperado. Tente novamente.',
      code: error.response?.data?.code ?? 'UNKNOWN_ERROR',
      statusCode: status ?? 0,
      details: error.response?.data?.details,
    }

    return Promise.reject(apiError)
  },
)

export default apiClient
