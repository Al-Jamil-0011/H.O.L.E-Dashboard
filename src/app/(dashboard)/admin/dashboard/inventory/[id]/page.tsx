"use client";

import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft, Eye, FileText, Calendar, MapPin, Box, Truck, UserCircle2,
  Activity, ShieldCheck, History, Info, Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSingleInventory } from '@/hooks/admin/inventory';
import Loader from '@/components/loader';
import { StatusBadge } from '@/components/ui/DataTable';
import Image from 'next/image';

export default function InventoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { inventory, loading } = useSingleInventory(id);
  console.log("inventory", inventory)

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[60vh]">
        <Loader size={32} text="Fetching inventory data..." />
      </div>
    );
  }

  if (!inventory) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[60vh] gap-4">
        <Package className="h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-medium text-muted-foreground">Inventory not found</p>
        <button
          onClick={() => router.push('/admin/dashboard/inventory')}
          className="text-primary hover:underline font-medium"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  const isImplant = inventory.productType === 'Implant';
  const isTray = inventory.productType === 'Tray';
  const isBio = inventory.productType === 'Bio';

  const title = isBio ? inventory.itemName : (isTray ? inventory.title : inventory.serialNumber);
  const status = inventory.productStatus || 'Available';

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const creator = (inventory.createdBy && typeof inventory.createdBy !== 'string')
    ? (inventory.createdBy as { _id: string; fullName: string; email: string; role: string; profileUrl?: string })
    : null;

  const facility = (inventory.facility && typeof inventory.facility !== 'string')
    ? (inventory.facility as { _id: string; name: string; address: string })
    : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-border pb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/dashboard/inventory')}
            className="p-2.5 bg-muted hover:bg-muted/80 rounded-xl transition-all border border-border group cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {title || 'Unnamed Item'}
              </h1>
              <StatusBadge status={status} type="inventory" />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Box className="h-3.5 w-3.5" />
              {inventory.productType} • {inventory.systemType || 'General System'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold dark:shadow-lg dark:shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Update Status
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


        <div className="lg:col-span-2 space-y-8">
          {(inventory.initialPhoto || (inventory.inboundFiles && inventory.inboundFiles.length > 0)) && (
            <div className="bg-card rounded-2xl border border-border overflow-hidden dark:shadow-sm">
              <div className="aspect-[21/9] w-full bg-muted relative">
                <Image
                  src={inventory?.initialPhoto || inventory?.inboundFiles?.[0] || ''}
                  alt="Item Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
                    Main Reference
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-card rounded-2xl border border-border p-8 dark:shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">Item Specifications</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <DetailItem
                label="Product Type"
                value={inventory.productType}
                icon={<Package className="h-4 w-4" />}
              />
              <DetailItem
                label="System Type"
                value={inventory.systemType}
                icon={<Activity className="h-4 w-4" />}
              />

              {isImplant && (
                <DetailItem
                  label="Serial Number"
                  value={inventory.serialNumber}
                  icon={<ShieldCheck className="h-4 w-4" />}
                />
              )}

              {isTray && (
                <>
                  <DetailItem
                    label="Tray ID"
                    value={inventory.title}
                    icon={<ShieldCheck className="h-4 w-4" />}
                  />
                  <DetailItem
                    label="Inventory Type"
                    value={inventory.inventory}
                    icon={<History className="h-4 w-4" />}
                  />
                  <DetailItem
                    label="Return Date"
                    value={formatDate(inventory.returnDate)}
                    icon={<Calendar className="h-4 w-4" />}
                  />
                </>
              )}

              {isBio && (
                <>
                  <DetailItem
                    label="Lot Number"
                    value={inventory.lotNumber}
                    icon={<ShieldCheck className="h-4 w-4" />}
                  />
                  <DetailItem
                    label="Quantity"
                    value={inventory.quantity}
                    icon={<Activity className="h-4 w-4" />}
                  />
                  <DetailItem
                    label="Expiry Date"
                    value={formatDate(inventory.expiryDate)}
                    icon={<Calendar className="h-4 w-4 text-rose-500" />}
                  />
                </>
              )}

              <DetailItem
                label="Registered On"
                value={formatDate(inventory.createdAt)}
                icon={<Calendar className="h-4 w-4" />}
              />
            </div>
          </div>


          <div className="bg-card rounded-2xl border border-border p-8 dark:shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">Location & Logistics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="col-span-full pb-4 border-b border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Assigned Facility</p>
                {facility ? (
                  <div>
                    <p className="text-base font-bold text-foreground">{facility.name}</p>
                    <p className="text-xs font-medium text-muted-foreground">{facility.address}</p>
                  </div>
                ) : (
                  <p className="text-base font-bold text-foreground">{inventory.location || 'Not Specified'}</p>
                )}
              </div>

              {inventory.recipientEmail && (
                <DetailItem
                  label="Recipient Email"
                  value={inventory.recipientEmail}
                  icon={<UserCircle2 className="h-4 w-4" />}
                />
              )}
            </div>
          </div>


          {isTray && (inventory.sendTray || inventory.receiveTray) && (
            <div className="space-y-6">
              {inventory.sendTray && (
                <div className="bg-card rounded-2xl border border-border p-8 dark:shadow-sm">
                  <div className="flex items-center gap-2 mb-8">
                    <Truck className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">Sending Logistics</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <DetailItem label="Recipient Name" value={inventory.sendTray.recipientName} icon={<UserCircle2 className="h-4 w-4" />} />
                      <DetailItem label="Recipient Email" value={inventory.sendTray.recipientEmail} icon={<Info className="h-4 w-4" />} />
                      <DetailItem label="System Type" value={inventory.sendTray.systemType} icon={<Activity className="h-4 w-4" />} />
                    </div>
                    {inventory.sendTray.initialPhoto && (
                      <div className="rounded-xl overflow-hidden border border-border aspect-video relative group">
                        <Image
                          src={inventory.sendTray.initialPhoto}
                          alt="Send Tray"
                          width={0}
                          height={0}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}
                    {inventory.sendTray.notes && (
                      <div className="col-span-full">
                        <NoteBlock title="Sending Notes" content={inventory.sendTray.notes} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {inventory.receiveTray && (
                <div className="bg-card rounded-2xl border border-border p-8 dark:shadow-sm">
                  <div className="flex items-center gap-2 mb-8">
                    <History className="h-5 w-5 text-emerald-500" />
                    <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">Receiving Logistics</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {inventory.receiveTray.initialPhoto && (
                      <div className="rounded-xl overflow-hidden border border-border aspect-video relative group">
                        <Image
                          src={inventory.receiveTray.initialPhoto}
                          alt="Receive Tray"
                          width={0}
                          height={0}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}
                    {inventory.receiveTray.brokenFiles && inventory.receiveTray.brokenFiles.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reports</p>
                        {inventory.receiveTray.brokenFiles.map((file: string, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                            <span className="text-xs font-bold text-foreground">Broken Item Image {idx + 1}</span>
                            <a href={file} target="_blank" rel="noreferrer" className="p-1.5 hover:text-primary transition-colors">
                              <Eye className="h-4 w-4" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}


          {(inventory.notes || inventory.inboundNotes || inventory.brokenInstrumentsNotes) && (
            <div className="bg-card rounded-2xl border border-border p-8 dark:shadow-sm">
              <div className="flex items-center gap-2 mb-8">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">Important Notes</h2>
              </div>
              <div className="space-y-6">
                {inventory.notes && <NoteBlock title="General Notes" content={inventory.notes} />}
                {inventory.inboundNotes && <NoteBlock title="Inbound Notes" content={inventory.inboundNotes} />}
                {inventory.brokenInstrumentsNotes && <NoteBlock title="Broken Instruments Notes" content={inventory.brokenInstrumentsNotes} color="rose" />}
              </div>
            </div>
          )}


          {((inventory?.inboundFiles?.length ?? 0) > 0 || (inventory?.brokenFiles?.length ?? 0) > 0) && (
            <div className="bg-card rounded-2xl border border-border p-8 dark:shadow-sm">
              <h2 className="text-lg font-bold text-foreground uppercase tracking-tight mb-8">Evidence & Documents</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {inventory.inboundFiles?.map((file: string, idx: number) => (
                  <MediaCard key={idx} url={file} title="Inbound Document" />
                ))}
                {inventory.brokenFiles?.map((file: string, idx: number) => (
                  <MediaCard key={idx} url={file} title="Broken Item Report" color="rose" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* right side details */}
        <div className="space-y-8">

          {/* CREATOR INFO */}
          <div className="bg-card rounded-2xl border border-border p-6 dark:shadow-sm">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Submitted By</p>
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden border border-border bg-muted">
                {creator?.profileUrl ? (
                  <Image
                    src={creator.profileUrl ?? ""}
                    alt={creator.fullName}
                    className="h-full w-full object-cover"
                    width={48}
                    height={48}
                  />
                ) : (
                  <UserCircle2 className="h-full w-full text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{creator?.fullName || 'Internal Admin'}</p>
                <p className="text-[10px] font-medium text-muted-foreground uppercase">{creator?.role || 'System'}</p>
              </div>
            </div>
          </div>

          {/* VENDOR INFO */}
          <div className="bg-card rounded-2xl border border-border p-6 dark:shadow-sm">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Vendor Partner</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Box className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{inventory.vendor?.name}</p>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">{inventory.vendor?.companyName}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Contact</p>
                <p className="text-xs font-bold text-foreground">{inventory.vendor?.email}</p>
                <p className="text-xs font-medium text-muted-foreground">{inventory.vendor?.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="space-y-3 pt-4">
            <button className="w-full py-3.5 bg-muted border border-border rounded-xl text-xs font-medium text-foreground hover:bg-muted/80 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <History className="h-4 w-4" />
              Inventory History
            </button>
            <button className="w-full py-3.5 bg-muted border border-border rounded-xl text-xs font-medium text-foreground hover:bg-muted/80 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Truck className="h-4 w-4" />
              Related Shipments
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function DetailItem({ label, value, icon, className }: { label: string, value: any, icon: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
        {icon}
        {label}
      </p>
      <p className="text-sm font-bold text-foreground">{value || 'N/A'}</p>
    </div>
  );
}

function NoteBlock({ title, content, color = "primary" }: { title: string, content: string, color?: "primary" | "rose" }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
      <div className={cn(
        "p-4 rounded-xl border border-border relative overflow-hidden bg-muted/30",
      )}>
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-1",
          color === "rose" ? "bg-rose-500" : "bg-primary"
        )} />
        <p className="text-sm font-medium text-muted-foreground leading-relaxed pl-2 italic">
          &quot;{content}&quot;
        </p>
      </div>
    </div>
  );
}

function MediaCard({ url, title, color = "primary" }: { url: string, title: string, color?: "primary" | "rose" }) {
  return (
    <div className="group border border-border rounded-xl overflow-hidden bg-muted/20 hover:border-primary/50 transition-all">
      <div className="aspect-video w-full relative">
        <Image
          src={url}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          width={100}
          height={100}
        />
      </div>
      <div className="p-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{title}</p>
          <p className="text-[11px] font-bold text-foreground">Attached Document</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-primary transition-colors"
        >
          <Eye className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

