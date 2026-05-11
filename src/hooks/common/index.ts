"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import useApi from "../use-api";
import { IApiResponse, IFacility, IPhysician, IPractice } from "./interface";


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


export function usePhysicians() {
    const [physicians, setPhysicians] = useState<IPhysician[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const [error, setError] = useState<string | null>(null);

    const fetchPhysicians = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.get<
                    IApiResponse<IPhysician[]>
                >("/common/all-physicians");

            setPhysicians(response?.data?.data || []);
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to fetch physicians";

            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPhysicians();
    }, [fetchPhysicians]);

    const physicianOptions = useMemo(
        () =>
            physicians.map((p) => ({
                label: p.fullName,
                value: p._id,
            })),
        [physicians]
    );

    return {
        physicians,
        physicianOptions,
        loading,
        error,
        refetch: fetchPhysicians,
    };
}


export function useFacilities() {
    const [facilities, setFacilities] = useState<IFacility[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const [error, setError] = useState<string | null>(null);

    const fetchFacilities = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.get<
                    IApiResponse<IFacility[]>
                >("/common/all-facilities");

            setFacilities(response?.data?.data || []);
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to fetch facilities";

            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFacilities();
    }, [fetchFacilities]);

    const facilityOptions = useMemo(
        () =>
            facilities.map((f) => ({
                label: f.name,
                value: f._id,
            })),
        [facilities]
    );

    return {
        facilities,
        facilityOptions,
        loading,
        error,
        refetch: fetchFacilities,
    };
}