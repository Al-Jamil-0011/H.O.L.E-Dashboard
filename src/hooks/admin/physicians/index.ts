"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import {
  IApiResponse,
  IPaginationMeta,
  IPhysician,
  IPhysicianPayload,
  IPhysicianQuery,
  IPhysicianResponse,
  IUpdatePhysicianPayload,
} from "./interface";
import useApi from "@/hooks/use-api";

export function usePhysicians() {
  const [physicians, setPhysicians] = useState<IPhysician[]>([]);

  const [meta, setMeta] = useState<IPaginationMeta | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState<IPhysicianQuery>({
    page: 1,
    limit: 10,
    searchTerm: "",
  });

  const fetchPhysicians = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      params.append("page", String(query.page));

      params.append("limit", String(query.limit));

      if (query.searchTerm) {
        params.append("searchTerm", query.searchTerm);
      }

      const response = await useApi.get<IApiResponse<IPhysicianResponse>>(
        `/physician/get-all?${params.toString()}`,
      );

      setPhysicians(response?.data?.data?.results || []);

      setMeta(response?.data?.data?.meta || null);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to fetch physicians";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchPhysicians();
  }, [fetchPhysicians]);

  return {
    physicians,
    meta,

    loading,
    error,

    query,
    setQuery,

    refetch: fetchPhysicians,
  };
}

export function useSinglePhysician(id?: string) {
  const [physician, setPhysician] = useState<IPhysician | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const fetchPhysician = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await useApi.get<IApiResponse<IPhysician>>(
        `/physician/find/${id}`,
      );

      setPhysician(response?.data?.data || null);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to fetch physician";

      setError(message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }
  }, [id]);

  useEffect(() => {
    fetchPhysician();
  }, [fetchPhysician]);

  return {
    physician,
    loading,
    error,
    refetch: fetchPhysician,
  };
}

export function useCreatePhysician() {
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const createPhysician = async (payload: IPhysicianPayload) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append("fullName", payload.fullName);

      formData.append("email", payload.email);

      formData.append("practice", payload.practice);

      formData.append("specialty", payload.specialty);

      formData.append("phoneNumber", payload.phoneNumber);

      formData.append("cellNumber", payload.cellNumber);

      formData.append("dateOfBirth", payload.dateOfBirth);

      formData.append("noteToSelf", payload.noteToSelf);

      if (payload.location) {
        formData.append("location", payload.location);
      }

      if (payload.profile) {
        formData.append("profile", payload.profile);
      }

      if (payload.docs && payload.docs.length > 0) {
        payload.docs.forEach((file) => {
          formData.append("docs", file);
        });
      }

      const response = await useApi.post<IApiResponse<IPhysician>>(
        "/physician/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response?.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to create physician";

      setError(message);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPhysician,
    loading,
    error,
  };
}

export function useUpdatePhysician() {
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const updatePhysician = async (
    id: string,
    payload: IUpdatePhysicianPayload,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      if (payload.fullName) {
        formData.append("fullName", payload.fullName);
      }

      if (payload.email) {
        formData.append("email", payload.email);
      }

      if (payload.practice) {
        formData.append("practice", payload.practice);
      }

      if (payload.specialty) {
        formData.append("specialty", payload.specialty);
      }

      if (payload.phoneNumber) {
        formData.append("phoneNumber", payload.phoneNumber);
      }

      if (payload.cellNumber) {
        formData.append("cellNumber", payload.cellNumber);
      }

      if (payload.dateOfBirth) {
        formData.append("dateOfBirth", payload.dateOfBirth);
      }

      if (payload.noteToSelf) {
        formData.append("noteToSelf", payload.noteToSelf);
      }

      if (payload.location) {
        formData.append("location", payload.location);
      }

      if (payload.profile) {
        formData.append("profile", payload.profile);
      }

      if (payload.docs && payload.docs.length > 0) {
        payload.docs.forEach((file) => {
          formData.append("docs", file);
        });
      }

      const response = await useApi.patch<IApiResponse<IPhysician>>(
        `/physician/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response?.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to update physician";

      setError(message);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updatePhysician,
    loading,
    error,
  };
}

export function useDeletePhysician() {
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const deletePhysician = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await useApi.delete<IApiResponse<IPhysician>>(
        `/physician/delete/${id}`,
      );

      return response?.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to delete physician";

      setError(message);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    deletePhysician,
    loading,
    error,
  };
}
