"use client";

import { customToast } from "@/lib/utils";
import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,
} from "axios";
import Cookies from "js-cookie";

const useApi: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URI,
    withCredentials: true,
});
useApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token =
            document?.cookie
                ?.split("; ")
                ?.find((row) => row.startsWith("token="))
                ?.split("=")[1] || null;

        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
useApi.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        return response;
    },
    (error: AxiosError<any>) => {
        const status = error.response?.status;
        const messageText = error.response?.data?.message;

        if (status === 401 || status === 403) {
            Cookies.remove("token");
            const currentPath = window.location.pathname;
            const redirectUrl = `/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`;
            console.log('🚀 ~ API Error ~ 401/403:', messageText);
            customToast.error(messageText || 'You are not authorized to access this page.');
            window.location.href = redirectUrl;
        } else if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
            console.error('🚀 ~ API Network Error:', error);
            customToast.error('Network Connection Error: Server is unreachable. Please check your network and try again.');
        } else if (status && status >= 500) {
            console.error(`🚀 ~ API Server Error ${status}:`, messageText || error.message);
            customToast.error(messageText || 'Server Error: Something went wrong on our end. Please try again later.');
        }

        return Promise.reject(error);
    }
);

export default useApi;