"use client";

import { useCallback, useState } from "react";
import { INotification, INotificationResponse, IServiceResponse } from "./interface";
import useApi from "../use-api";

export function useNotificationService() {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllNotifications = useCallback(
        async (page = 1, limit = 10) => {
            try {
                setLoading(true);
                setError(null);

                const response = await useApi.get<
                    IServiceResponse<INotificationResponse>
                >(`/notification/get-all`, {
                    params: { page, limit },
                });

                const data = response?.data?.data;

                setNotifications(data?.results || []);
                setTotalPages(data?.pagination?.totalPage || 0);
                setTotalItems(data?.pagination?.totalResult || 0);
                return data; // Return data for direct use in components
            } catch (err: any) {
                const errorMessage =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to fetch notifications";

                setError(errorMessage);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await useApi.get<
                IServiceResponse<{ unread_count: number }>
            >(`/notification/count/unread`);

            setUnreadCount(response?.data?.data?.unread_count || 0);
        } catch (err: any) {
            console.error("Failed to fetch unread count", err);
        }
    }, []);

    return {
        notifications,
        unreadCount,
        totalPages,
        totalItems,
        loading,
        error,
        fetchAllNotifications,
        fetchUnreadCount,
    };
}