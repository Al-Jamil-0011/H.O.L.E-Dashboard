"use client"
import Loader from '@/components/loader';
import { useSingleShipment } from '@/hooks/admin/shipment';
import {
    ChevronLeft, Download, FileText,
    MapPin, Stethoscope, Briefcase, CheckCircle2, Clock,
    ExternalLink, Building2, Activity, Package, AlertTriangle, Phone, UserCircle2, Truck, Calendar
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1) + ' km';
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

export default function ShipmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { shipment, loading: isLoading, error } = useSingleShipment(id);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyDFiKLw_sSi4BAjNEBe1HYIqG-FDAs86Kk"
    });

    const liveDistance = React.useMemo(() => {
        if (shipment?.pickupInfo?.location?.coordinates && shipment?.assigneeDriver?.currentLocation?.coordinates) {
            const [pickupLon, pickupLat] = shipment.pickupInfo.location.coordinates;
            const [driverLon, driverLat] = shipment.assigneeDriver.currentLocation.coordinates;
            return calculateDistance(pickupLat, pickupLon, driverLat, driverLon);
        }
        return null;
    }, [shipment]);

    const pickupLocation = React.useMemo(() => {
        if (shipment?.pickupInfo?.location?.coordinates) {
            return {
                lat: shipment.pickupInfo.location.coordinates[1],
                lng: shipment.pickupInfo.location.coordinates[0]
            };
        }
        return null;
    }, [shipment]);

    const driverLocation = React.useMemo(() => {
        if (shipment?.assigneeDriver?.currentLocation?.coordinates) {
            return {
                lat: shipment.assigneeDriver.currentLocation.coordinates[1],
                lng: shipment.assigneeDriver.currentLocation.coordinates[0]
            };
        }
        return null;
    }, [shipment]);

    const mapCenter = React.useMemo(() => {
        if (pickupLocation && driverLocation) {
            return {
                lat: (pickupLocation.lat + driverLocation.lat) / 2,
                lng: (pickupLocation.lng + driverLocation.lng) / 2
            };
        }
        return { lat: 23.7776, lng: 90.4055 };
    }, [pickupLocation, driverLocation]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-[60vh]">
                <Loader size={32} text="Fetching order details..." />
            </div>
        );
    }

    if (!shipment) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    <Activity className="h-10 w-10" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Shipment Not Found</h2>
                <p className="text-muted-foreground font-medium">The shipment you are looking for does not exist.</p>
                <Link href="/admin/dashboard/shipments"
                    className="px-6 py-2 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 transition-colors mt-2 dark:shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
                    Back to Shipments
                </Link>
            </div>
        );
    }

    // Helper for status colors
    const getStatusColor = (status: string) => {
        const s = status?.toLowerCase() || '';
        if (s === 'delivered' || s === 'completed' || s === 'available' || s === 'in stock') return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        if (s === 'pending' || s === 'pending_approval' || s === 'urgent') return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        if (s === 'active' || s === 'in_transit' || s === 'accepted') return 'bg-primary/10 text-primary border-primary/20';
        return 'bg-muted text-muted-foreground border-border';
    };

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard/shipments" className="p-2 bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <ChevronLeft className="h-5 w-5 text-primary" />
                    </Link>
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-foreground tracking-tight">Shipment {shipment.shipmentId}</h1>
                            <span className={cn("px-2.5 py-0.5 text-xs font-bold rounded-full border capitalize", getStatusColor(shipment.status))}>
                                {shipment.status}
                            </span>
                            {shipment.shipmentInfo?.priority === 'urgent' && (
                                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full border bg-rose-500/10 text-rose-500 border-rose-500/20 capitalize flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" /> Urgent
                                </span>
                            )}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Created on {dayjs(shipment.createdAt).format('MMMM DD, YYYY [at] hh:mm A')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border text-foreground font-medium rounded-xl hover:bg-muted transition-colors w-full sm:w-auto">
                        <FileText className="h-4 w-4 text-primary" /> Invoice
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Job Info */}
                    <div className="bg-card border border-border rounded-2xl p-6 dark:shadow-sm">
                        <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" /> Job Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0 border border-primary/20">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Company / Facility</p>
                                    <p className="text-base font-bold text-foreground">{shipment.shipmentInfo?.company || 'N/A'}</p>
                                    <p className="text-xs font-medium text-muted-foreground mt-0.5 capitalize">{shipment.shipmentInfo?.type || 'Standard'} Package</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0 border border-emerald-500/20">
                                    <UserCircle2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Assigned Driver</p>
                                    <p className="text-base font-bold text-foreground">{shipment.assigneeDriver?.fullName || 'Unassigned'}</p>
                                    <p className="text-xs font-medium text-muted-foreground mt-0.5">{shipment.assigneeDriver?.email || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Items */}
                    <div className="bg-card border border-border rounded-2xl p-6 dark:shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" /> Inventory Items ({shipment.products?.length || 0})
                            </h2>
                        </div>

                        {shipment.products && shipment.products.length > 0 ? (
                            <div className="space-y-3">
                                {shipment.products.map((p: any) => (
                                    <div key={p._id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center dark:shadow-sm text-primary bg-primary/5">
                                                <Stethoscope className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{p.product?.systemType || p.productType}</p>
                                                <p className="text-xs font-medium text-muted-foreground mt-1 tracking-wider">SN: {p.product?.serialNumber || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <span className={cn("px-2.5 py-1 text-[10px] font-bold rounded-full border capitalize whitespace-nowrap", getStatusColor(p.product?.productStatus))}>
                                            {p.product?.productStatus || 'Unknown'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center rounded-xl bg-muted/30 border border-border border-dashed">
                                <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                                <p className="text-sm font-medium text-muted-foreground">No inventory items attached to this shipment.</p>
                            </div>
                        )}
                    </div>

                    {/* Tracking History */}
                    <div className="bg-card border border-border rounded-2xl p-6 dark:shadow-sm">
                        <h2 className="text-base font-bold text-foreground mb-6 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" /> Tracking History
                        </h2>

                        {shipment.trackingHistory && shipment.trackingHistory.length > 0 ? (
                            <div className="relative ml-4 md:ml-8">
                                <div className="absolute left-[9px] top-4 bottom-4 w-px bg-border" />
                                <div className="space-y-8 relative">
                                    {shipment.trackingHistory.map((event: any, idx: number) => {
                                        const isLast = idx === shipment.trackingHistory.length - 1;
                                        return (
                                            <div key={event._id || idx} className="flex gap-6">
                                                <div className={cn(
                                                    "relative z-10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-4 border-card",
                                                    isLast ? "bg-primary dark:shadow-[0_0_10px_rgba(var(--primary-rgb),0.4)]" : "bg-muted-foreground"
                                                )} />
                                                <div className="flex-1 space-y-1.5 pb-2">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                        <span className={cn("text-sm font-bold", isLast ? "text-primary" : "text-foreground")}>
                                                            {event.title || event.status}
                                                        </span>
                                                        <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md border border-border">
                                                            {dayjs(event.timestamp).format('MMM DD, YYYY hh:mm A')}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium text-muted-foreground">{event.description}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No tracking history available.</p>
                        )}
                    </div>
                </div>

                {/* Right Column - Route & Summary */}
                <div className="space-y-6">

                    {/* Route Details */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden dark:shadow-sm flex flex-col">
                        <div className="h-64 relative bg-muted flex items-center justify-center border-b border-border overflow-hidden">
                            {isLoaded && pickupLocation && driverLocation ? (
                                <GoogleMap
                                    mapContainerStyle={{ width: '100%', height: '100%' }}
                                    center={mapCenter}
                                    zoom={12}
                                    options={{ disableDefaultUI: true, mapTypeControl: false, streetViewControl: false }}
                                >
                                    {/* Red Line for Distance */}
                                    <Polyline
                                        path={[pickupLocation, driverLocation]}
                                        options={{
                                            strokeColor: '#ef4444',
                                            strokeOpacity: 0.8,
                                            strokeWeight: 4,
                                        }}
                                    />
                                    {/* Pickup Marker showing total distance */}
                                    <Marker
                                        position={pickupLocation}
                                        label={{
                                            text: `${liveDistance || shipment.totalDistance || '0 km'}`,
                                            color: '#000000',
                                            fontWeight: 'bold',
                                            className: 'bg-white px-2 py-1 rounded-md shadow-md text-xs border border-gray-200 mt-8'
                                        }}
                                    />
                                    {/* Driver Marker */}
                                    <Marker
                                        position={driverLocation}
                                    />
                                </GoogleMap>
                            ) : (
                                <>
                                    {/* Abstract Map Background Placeholder */}
                                    <div className="absolute inset-0 bg-background/50" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '16px 16px', opacity: 0.05 }}></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-80" />

                                    <div className="relative z-10 pointer-events-none">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card border border-border px-3 py-1 rounded-md text-[10px] font-bold text-foreground whitespace-nowrap dark:shadow-md pointer-events-auto flex items-center gap-1.5">
                                            <MapPin className="h-3 w-3 text-primary" />
                                            {liveDistance ? `${liveDistance} away` : (shipment.totalDistance || 'Calculating...')}
                                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-r border-b border-border rotate-45" />
                                        </div>
                                        <div className="w-8 h-8 bg-primary rounded-full border-4 border-card flex items-center justify-center dark:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]">
                                            <Truck className="h-3 w-3 text-primary-foreground" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-5 space-y-6 bg-card">
                            <h3 className="text-sm font-bold text-foreground flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Route Information</h3>

                            <div className="relative ml-2">
                                <div className="absolute left-[7px] top-4 bottom-6 w-px bg-border" />

                                {/* Pickup */}
                                <div className="flex gap-4 mb-6">
                                    <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-card shrink-0 mt-1 relative z-10" />
                                    <div className="space-y-2 flex-1">
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Pickup Location</p>
                                            <p className="text-sm font-bold text-foreground">{shipment.pickupInfo?.address || 'N/A'}</p>
                                        </div>
                                        <div className="bg-muted/30 rounded-xl p-3 border border-border space-y-2">
                                            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                                                <span>Phone</span>
                                                <span className="text-foreground flex items-center gap-1">
                                                    <Phone className="h-3 w-3 text-primary" /> {shipment.pickupInfo?.phoneNumber || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground pt-2 border-t border-border/50">
                                                <span>Date</span>
                                                <span className="text-foreground font-bold">{shipment.pickupInfo?.pickupDate ? dayjs(shipment.pickupInfo.pickupDate).format('MMM DD, hh:mm A') : 'N/A'}</span>
                                            </div>
                                            {shipment.pickupInfo?.instructions && (
                                                <div className="pt-2 border-t border-border/50">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Instructions</span>
                                                    <span className="text-xs font-medium text-foreground block">{shipment.pickupInfo.instructions}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dropoff */}
                                <div className="flex gap-4">
                                    <div className="w-4 h-4 rounded-full bg-rose-500 border-4 border-card shrink-0 mt-1 relative z-10" />
                                    <div className="space-y-2 flex-1">
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Drop-off Location</p>
                                            <p className="text-sm font-bold text-foreground">{shipment.dropoffInfo?.address || 'N/A'}</p>
                                        </div>
                                        <div className="bg-muted/30 rounded-xl p-3 border border-border space-y-2">
                                            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                                                <span>Phone</span>
                                                <span className="text-foreground flex items-center gap-1"><Phone className="h-3 w-3 text-primary" /> {shipment.dropoffInfo?.phoneNumber || 'N/A'}</span>
                                            </div>
                                            {shipment.dropoffInfo?.instructions && (
                                                <div className="pt-2 border-t border-border/50">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Instructions</span>
                                                    <span className="text-xs font-medium text-foreground block">{shipment.dropoffInfo.instructions}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Package Details */}
                    <div className="bg-card border border-border rounded-2xl p-6 dark:shadow-sm">
                        <h3 className="text-sm font-bold text-foreground mb-4">Package Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                                <span className="text-xs font-bold text-muted-foreground capitalize">Service Type</span>
                                <span className="text-sm font-bold text-amber-500 capitalize flex items-center gap-1">
                                    <Truck size={14} />
                                    {shipment.packageInfo?.serviceType || 'Standard'}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-muted/30 border border-border text-center">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Weight</span>
                                    <span className="text-sm font-bold text-foreground">{shipment.packageInfo?.weight || 'N/A'}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/30 border border-border text-center">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Dimensions</span>
                                    <span className="text-sm font-bold text-foreground">{shipment.packageInfo?.dimensions || 'N/A'}</span>
                                </div>
                            </div>

                            {shipment.packageInfo?.spacialInstructions && (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-amber-600 dark:text-amber-500 mb-1">Special Instructions</p>
                                        <p className="text-xs font-medium text-amber-600/80 dark:text-amber-500/80 leading-relaxed">{shipment.packageInfo.spacialInstructions}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 dark:shadow-sm">
                        <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-widest">Pricing Summary</h3>
                        <div className="space-y-3 mb-5">
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span className="text-muted-foreground">Base Rate</span>
                                <span className="text-foreground">${shipment.shippingCost?.baseRate || '0.00'}</span>
                            </div>
                            {(shipment.shippingCost?.priorityCharge || 0) > 0 && (
                                <div className="flex items-center justify-between text-sm font-medium">
                                    <span className="text-muted-foreground capitalize">Priority Charge ({shipment.shippingCost.priority})</span>
                                    <span className="text-foreground">${shipment.shippingCost.priorityCharge}</span>
                                </div>
                            )}
                        </div>
                        <div className="pt-4 border-t border-primary/20 flex items-end justify-between">
                            <span className="text-sm font-bold text-foreground">Total Estimated</span>
                            <div className="flex items-baseline text-primary">
                                <span className="text-lg font-bold mr-1">$</span>
                                <span className="text-3xl font-black tracking-tight">{shipment.totalPrice || '0.00'}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}