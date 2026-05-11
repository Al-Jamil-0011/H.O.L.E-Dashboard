'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import useApi from "@/hooks/use-api";
import { IApiResponse, IPaginationMeta, IShipment, IShipmentDetail, IShipmentDetailResponse, IShipmentQuery, IShipmentSummary } from "./interface";



export function useShipmentSummary() {
    const [summary, setSummary] =
        useState<IShipmentSummary | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchSummary = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.get<IApiResponse<IShipmentSummary>>(
                    `/shipment/summary`
                );

            setSummary(response?.data?.data || null);
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to fetch shipment summary";

            setError(message);
        } finally {
            setTimeout(() => setLoading(false), 300);
        }
    }, []);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    return {
        summary,
        loading,
        error,
        refetch: fetchSummary,
    };
}


export function useShipments() {
    const [shipments, setShipments] =
        useState<IShipment[]>([]);

    const [meta, setMeta] =
        useState<IPaginationMeta | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const [query, setQuery] =
        useState<IShipmentQuery>({
            page: 1,
            limit: 10,
            searchTerm: "",
            status: "",
            method: "",

        });

    const fetchShipments = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();

            params.append("page", String(query.page));

            params.append("limit", String(query.limit));

            if (query.searchTerm) {
                params.append("searchTerm", query.searchTerm);
            }

            if (query.status) {
                params.append("status", query.status);
            }

            if (query.method) {
                params.append("method", query.method);
            }

            const response =
                await useApi.get<
                    IApiResponse<{
                        meta: IPaginationMeta;
                        results: IShipment[];
                    }>
                >(`/shipment/get-all?${params.toString()}`);

            setShipments(response?.data?.data?.results || []);
            setMeta(response?.data?.data?.meta || null);
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to fetch shipments";

            setError(message);
        } finally {
            setTimeout(() => setLoading(false), 300);
        }
    }, [query]);

    useEffect(() => {
        fetchShipments();
    }, [fetchShipments]);

    return {
        shipments,
        meta,
        loading,
        error,
        query,
        setQuery,
        refetch: fetchShipments,
    };
}


export function useSingleShipment(id?: string) {
    const [shipment, setShipment] =
        useState<IShipmentDetail | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchShipment = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.get<IShipmentDetailResponse>(
                    `/shipment/find/${id}`
                );

            setShipment(response?.data?.data || null);
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to fetch shipment";

            setError(message);
        } finally {
            setTimeout(() => setLoading(false), 300);
        }
    }, [id]);

    useEffect(() => {
        fetchShipment();
    }, [fetchShipment]);

    return {
        shipment,
        loading,
        error,
        refetch: fetchShipment,
    };
}