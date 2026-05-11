"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import useApi from "../use-api";
import { IApiResponse, IPractice } from "./interface";


export function usePractices() {
    const [practices, setPractices] = useState<IPractice[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const [error, setError] = useState<string | null>(null);

    const fetchPractices = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.get<
                    IApiResponse<IPractice[]>
                >("/common/all-practices");

            setPractices(response?.data?.data || []);
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to fetch practices";

            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPractices();
    }, [fetchPractices]);

    const practiceOptions = useMemo(
        () =>
            practices.map((p) => ({
                label: p.practiceName,
                value: p._id,
            })),
        [practices]
    );

    return {
        practices,
        practiceOptions,
        loading,
        error,
        refetch: fetchPractices,
    };
}