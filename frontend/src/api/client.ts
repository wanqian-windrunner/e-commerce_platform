import axios from 'axios'
import type { ApiErrorResponse } from '@/types/common'

const baseURL = import.meta.env.VITE_API_BASE_URL

if (!baseURL) {
    throw new Error("VITE_API_BASE_URL is not defined in the environment variables.")
}

export const apiClient = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
})

export const parseApiError = (error: unknown): string => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const payload = error.response?.data
        if (Array.isArray(payload?.errors) && payload.errors.length) {
            return payload.errors.map(err => err.message).join('; ')
        }
        if (payload?.message) {
            return payload.message
        }
        if (!error.response) {
            return 'Network error.'
        }
    }
    return 'An unexpected error occurred.'
}