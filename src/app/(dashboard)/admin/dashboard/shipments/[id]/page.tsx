"use client"
import Loader from '@/components/loader';
import { useSingleShipment } from '@/hooks/admin/shipment';
import {
    ChevronLeft, Download, FileText,
    MapPin, Stethoscope, Briefcase, CheckCircle2, Clock,
    ExternalLink, Building2, Activity
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';


export default function ShipmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);

    const { shipment, loading: isLoading, error } = useSingleShipment(id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-[60vh]">
                <Loader size={32} text="Fetching order details..." />
            </div>
        );
    }

    if (!shipment) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
                    <Activity className="h-10 w-10" />
                </div>
                <h2 className="text-xl font-bold text-white">Shipment Not Found</h2>
                <p className="text-gray-400">The shipment you are looking for does not exist.</p>
                <Link href="/admin/dashboard/shipments"
                    className="px-6 py-2 bg-[#1E293B] text-white rounded-lg hover:bg-[#334155] transition-colors">
                    Go Back
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1>Shipment Details Page : # {id}</h1>
        </div>
    );
}