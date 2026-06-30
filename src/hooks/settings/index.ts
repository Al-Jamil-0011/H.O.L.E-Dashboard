/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useEffect, useState } from "react";
import useApi from "../use-api";

export interface ContentService {
  _id?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  published?: boolean;
}


export function useTerms() {
  const [terms, setTerms] = useState<ContentService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTerms = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await useApi.get<{ data: ContentService[] }>(
        "/common/terms"
      );
      setTerms(data?.data || []);
    } catch (error) {
      // console.error("Error fetching terms and conditions:", error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  return { terms, loading, refetch: fetchTerms };
}

export function useCreateTermService() {
  const [error, setError] = useState<string | null>(null);

  const createTerm = async (payload: Omit<ContentService, "_id">) => {
    try {
      const { data } = await useApi.post<{ data: ContentService }>(
        "/common/terms/create",
        payload
      );
      return data;
    } catch (err: any) {
      const message = err?.response?.data?.message || "An unexpected error occurred.";
      setError(message);
      // console.error("Error creating terms and conditions:", err);
      return null;
    }
  };

  return { createTerm, error };
}

export function useUpdateTermService() {
  const [error, setError] = useState<string | null>(null);

  const updateTerm = async (id: string, payload: Partial<ContentService>) => {
    try {
      const { data } = await useApi.patch<{ data: ContentService }>(
        `/common/terms/update/${id}`,
        payload
      );
      return data;
    } catch (err: any) {
      const message = err?.response?.data?.message || "An unexpected error occurred.";
      setError(message);
      // console.error("Error updating terms and conditions:", err);
      return null;
    }
  };

  return { updateTerm, error };
}

export function usePrivacyPolicy() {
  const [policies, setPolicies] = useState<ContentService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await useApi.get<{ data: ContentService[] }>(
        "/common/privacy-policy"
      );
      setPolicies(data?.data || []);
    } catch (error) {
      // console.error("Error fetching privacy policies:", error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  return { policies, loading, refetch: fetchPolicies };
}

export function useCreatePrivacyPolicy() {
  const [error, setError] = useState<string | null>(null);

  const createPolicy = async (payload: Omit<ContentService, "_id">) => {
    try {
      const { data } = await useApi.post<{ data: ContentService }>(
        "/common/privacy-policy/create",
        payload
      );
      return data;
    } catch (err: any) {
      const message = err?.response?.data?.message || "An unexpected error occurred.";
      setError(message);
      // console.error("Error creating privacy policy:", err);
      return null;
    }
  };

  return { createPolicy, error };
}

export function useUpdatePrivacyPolicy() {
  const [error, setError] = useState<string | null>(null);

  const updatePolicy = async (id: string, payload: Partial<ContentService>) => {
    try {
      const { data } = await useApi.patch<{ data: ContentService }>(
        `/common/privacy-policy/update/${id}`,
        payload
      );
      return data;
    } catch (err: any) {
      const message = err?.response?.data?.message || "An unexpected error occurred.";
      setError(message);
      // console.error("Error updating privacy policy:", err);
      return null;
    }
  };

  return { updatePolicy, error };
}

export function useAboutUs() {
  const [abouts, setAbouts] = useState<ContentService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAbouts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await useApi.get<{ data: ContentService[] }>(
        "/common/about"
      );
      setAbouts(data?.data || []);
    } catch (error) {
      // console.error("Error fetching about us:", error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchAbouts();
  }, [fetchAbouts]);

  return { abouts, loading, refetch: fetchAbouts };
}

export function useCreateAboutUs() {
  const [error, setError] = useState<string | null>(null);

  const createAbout = async (payload: Omit<ContentService, "_id">) => {
    try {
      const { data } = await useApi.post<{ data: ContentService }>(
        "/settings/about-us/create",
        payload
      );
      return data;
    } catch (err: any) {
      const message = err?.response?.data?.message || "An unexpected error occurred.";
      setError(message);
      // console.error("Error creating about us:", err);
      return null;
    }
  };

  return { createAbout, error };
}

export function useUpdateAboutUs() {
  const [error, setError] = useState<string | null>(null);

  const updateAbout = async (id: string, payload: Partial<ContentService>) => {
    try {
      const { data } = await useApi.patch<{ data: ContentService }>(
        `/common/about/update/${id}`,
        payload
      );
      return data;
    } catch (err: any) {
      const message = err?.response?.data?.message || "An unexpected error occurred.";
      setError(message);
      // console.error("Error updating about us:", err);
      return null;
    }
  };

  return { updateAbout, error };
}

interface SupportFormData {
  email: string;
  phone: string;
  description: string;
}

/**  SUPPORT SERVICE  */
export function useSupport() {
  const [supports, setSupports] = useState<ContentService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSupports = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await useApi.get<{ data: ContentService[] }>(
        "/settings/support/all"
      );
      setSupports(data?.data || []);
    } catch (error) {
      // console.error("Error fetching support:", error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchSupports();
  }, [fetchSupports]);

  return { supports, loading, refetch: fetchSupports };
}

export function useCreateSupport() {
  const [error, setError] = useState<string | null>(null);

  const createSupport = async (payload: Omit<ContentService, "_id">) => {
    try {
      const { data } = await useApi.post<{ data: ContentService }>(
        "/settings/support/create",
        payload
      );
      return data;
    } catch (err: any) {
      const message = err?.response?.data?.message || "An unexpected error occurred.";
      setError(message);
      // console.error("Error creating about us:", err);
      return null;
    }
  };

  return { createSupport, error };
}

export function useUpdateSupport() {
  const [error, setError] = useState<string | null>(null);

  const updateSupport = async (id: string, payload: Partial<SupportFormData>) => {
    try {
      const { data } = await useApi.patch<{ data: SupportFormData }>(
        `/settings/support/update/${id}`,
        payload
      );
      return data;
    } catch (err: any) {
      const message = err?.response?.data?.message || "An unexpected error occurred.";
      setError(message);
      // console.error("Error updating support:", err);
      return null;
    }
  };

  return { updateSupport, error };
}
