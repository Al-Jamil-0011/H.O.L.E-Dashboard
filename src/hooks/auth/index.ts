/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useCallback } from "react";
import useApi from './../use-api/index';
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { IForgotPasswordPayload, ILoginPayload, IResetPasswordPayload, IVerifyOtpPayload } from "./interface";


export function useAuthService() {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [error, setError] = useState<undefined | null>(null)

    const login = useCallback(async (payload: ILoginPayload) => {
        setLoading(true);
        try {
            const { data } = await useApi.post("/auth/login", payload);
            return data;
        } catch (error: any) {
            setError(error?.response?.data?.message)
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const forgotPassword = useCallback(async (payload: IForgotPasswordPayload) => {
        setLoading(true);
        try {
            const { data } = await useApi.post("/auth/forgot-password", payload);
            return data;
        } catch (error: any) {
            setError(error?.response?.data?.message)
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);


    const verifyOtp = useCallback(async (payload: IVerifyOtpPayload) => {
        setLoading(true);
        try {
            const { data } = await useApi.post("/auth/forgot-otp-verify", payload);
            return data;
        } catch (error: any) {
            setError(error?.response?.data?.message)
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const resendOtp = useCallback(async (payload: IForgotPasswordPayload) => {
        // setLoading(true);
        try {
            const { data } = await useApi.post("/auth/resend-otp", payload);
            return data;
        } catch (error: any) {
            setError(error?.response?.data?.message)
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const resetPassword = useCallback(async (payload: IResetPasswordPayload) => {
        setLoading(true);
        try {
            const { data } = await useApi.post("/auth/reset-password", payload);
            return data;
        } catch (error: any) {
            setError(error?.response?.data?.message)
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const logoutUser = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await useApi.get("/auth/logout");
            if (data?.success) {
                Cookies.remove("token");
                Cookies.remove("refreshToken");
                router.push("/auth/login");
            }
            return data;
        } catch (error: any) {
            setError(error?.response?.data?.message)
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { login, forgotPassword, verifyOtp, resetPassword, loading, logoutUser, resendOtp, error };
}