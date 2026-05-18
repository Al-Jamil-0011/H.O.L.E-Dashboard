"use client";

import { useSingleInvoice } from "@/hooks/finance/invoice-management";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Printer,
    Building2,
    User,
    CreditCard,
    Briefcase,
    Activity,
    CheckCircle2,
    Download
} from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";

import { StatusBadge } from "@/components/ui/DataTable";
import Loader from "@/components/loader";
import { cn, customToast } from "@/lib/utils";
import Image from "next/image";

export default function InvoiceDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const invoiceId = params.id as string;
    const { invoice, loading, error } = useSingleInvoice(invoiceId);





    const handlePrint = () => {
        window.print();
    };

    const handleDownloadInvoice = async () => {
        const toastId = customToast.loading("Generating high-fidelity PDF statement...");

        try {
            // Dynamically import jsPDF for full SSR build safety
            const { default: jsPDF } = await import("jspdf");
            const doc = new jsPDF("p", "mm", "a4");

            // Slate Color Palette
            const primaryColor = [22, 163, 74];     // emerald-600
            const textDark = [17, 24, 39];         // slate-900
            const textMuted = [107, 114, 128];     // slate-500
            const borderGray = [229, 231, 235];     // slate-200
            const bgLight = [249, 250, 251];       // slate-50

            // 1. Draw Branded Top Header Accent
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("H.O.L.E LOGISTICS", 20, 25);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.setTextColor(textDark[0], textDark[1], textDark[2]);
            doc.text("INVOICE STATEMENT", 20, 33);

            // Statement Top Divider
            doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
            doc.setLineWidth(0.5);
            doc.line(20, 40, 190, 40);

            // 2. Draw Statement Meta Information
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);

            const metaX = 135;
            doc.text("Invoice ID:", metaX, 22);
            doc.text("Sale ID:", metaX, 27);
            doc.text("Date:", metaX, 32);
            doc.text("Due Date:", metaX, 37);

            doc.setFont("helvetica", "bold");
            doc.setTextColor(textDark[0], textDark[1], textDark[2]);

            const valX = 158;
            doc.text(invoiceInfo.invoiceNumber || 'N/A', valX, 22);
            doc.text(`#${invoice?.saleId || 'N/A'}`, valX, 27);
            doc.text(invoiceInfo.invoiceDate ? dayjs(invoiceInfo.invoiceDate).format("MMM DD, YYYY") : dayjs(invoice?.createdAt).format("MMM DD, YYYY"), valX, 32);
            doc.text(invoiceInfo.invoiceDate ? dayjs(invoiceInfo.invoiceDate).add(30, 'day').format("MMM DD, YYYY") : 'N/A', valX, 37);

            // Left Box: Billed To
            doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
            doc.rect(20, 46, 80, 42, "F");
            // Right Box: Prepared By
            doc.rect(110, 46, 80, 42, "F");

            // Card Header Text
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("BILLED TO (FACILITY)", 24, 52);

            doc.setTextColor(16, 185, 129); // emerald-500
            doc.text("PREPARED BY (REPRESENTATIVE)", 114, 52);

            // Card Values (Left - Facility)
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9.5);
            doc.setTextColor(textDark[0], textDark[1], textDark[2]);
            doc.text(facilityInfo.name || 'N/A', 24, 59);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
            doc.text(facilityInfo.contacts || 'Facility Contact', 24, 64);

            const addrLines = doc.splitTextToSize(facilityInfo.address || 'Address N/A', 72);
            doc.text(addrLines, 24, 69);

            const phoneMail = [];
            if (facilityInfo.phoneNumber) phoneMail.push(`Ph: ${facilityInfo.phoneNumber}`);
            if (facilityInfo.email) phoneMail.push(`Em: ${facilityInfo.email}`);
            doc.text(phoneMail.join(" | "), 24, 83);

            // Card Values (Right - Creator/Rep)
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9.5);
            doc.setTextColor(textDark[0], textDark[1], textDark[2]);
            doc.text(creatorInfo.fullName || 'Representative', 114, 59);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
            doc.text(creatorInfo.email || 'N/A', 114, 64);
            if (creatorInfo.designation) {
                doc.text(`Company: ${creatorInfo.designation}`, 114, 69);
            }
            if (invoice?.salesType) {
                doc.text(`Type: ${invoice.salesType.toUpperCase()} Sale`, 114, 74);
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(textDark[0], textDark[1], textDark[2]);
            doc.text("INVENTORY PRODUCTS INVOLVED", 20, 96);

            // Table Header Bar
            doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
            doc.rect(20, 100, 170, 8, "F");
            doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
            doc.line(20, 100, 190, 100);
            doc.line(20, 108, 190, 108);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
            doc.text("PRODUCT ID", 24, 105);
            doc.text("MODEL / DETAILS", 65, 105);
            doc.text("TYPE", 145, 105);
            doc.text("STATUS", 175, 105);

            let currentY = 114;
            const products = invoice?.inventoryProducts || [];

            if (products.length > 0) {
                products.forEach((p: any) => {
                    const prodId = typeof p.product === 'object' ? p.product?._id : p.product;
                    const model = p.productModel || 'N/A';
                    const type = p.productType || 'N/A';

                    let detailValue = '';
                    let productStatus = 'active';

                    if (p.product && typeof p.product === 'object') {
                        const prodObj = p.product;
                        if (model === 'PurchaseOrder') {
                            detailValue = `PO: ${prodObj.purchaseOrderNumber || 'N/A'}`;
                            if (prodObj.patientId) detailValue += ` | Pt ID: ${prodObj.patientId}`;
                            productStatus = prodObj.status || 'open';
                        } else if (model === 'Implant') {
                            detailValue = `${prodObj.systemType || 'N/A'} (SN: ${prodObj.serialNumber || 'N/A'})`;
                            productStatus = prodObj.productStatus || 'available';
                        } else if (model === 'Tray') {
                            detailValue = `${prodObj.title || 'N/A'} - ${prodObj.systemType || 'N/A'}`;
                            productStatus = prodObj.productStatus || prodObj.status || 'available';
                        } else if (model === 'Bio') {
                            detailValue = `${prodObj.itemName || 'N/A'} (Lot: ${prodObj.lotNumber || 'N/A'} | Qty: ${prodObj.quantity || 'N/A'})`;
                            productStatus = prodObj.productStatus || 'available';
                        }
                    }

                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.setTextColor(textDark[0], textDark[1], textDark[2]);

                    // Truncate long object id for tabular neatness
                    const truncatedId = prodId ? `${prodId.substring(0, 12)}...` : 'N/A';
                    doc.text(truncatedId, 24, currentY);

                    // Bold Model name and subtext dynamic values
                    doc.setFont("helvetica", "bold");
                    doc.text(model, 65, currentY);
                    if (detailValue) {
                        doc.setFont("helvetica", "normal");
                        doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
                        doc.setFontSize(7.5);
                        doc.text(detailValue, 65, currentY + 3.5);
                        doc.setFontSize(8);
                        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
                    }

                    doc.text(type, 145, currentY);
                    doc.text(productStatus.toUpperCase(), 175, currentY);

                    // Draw bottom record border line
                    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
                    doc.line(20, currentY + 5.5, 190, currentY + 5.5);

                    currentY += 12;
                });
            } else {
                doc.setFont("helvetica", "normal");
                doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
                doc.text("No product records mapped to this invoice statement.", 65, 120);
                currentY = 130;
            }

            // Draw Ledger Summary Calculations
            const totalsY = Math.max(currentY + 10, 150);
            doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
            doc.line(110, totalsY, 190, totalsY);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);

            const labelX = 110;
            const valueX = 185;

            doc.text("Gross Subtotal:", labelX, totalsY + 6);
            doc.text("Total Commissions:", labelX, totalsY + 11);
            doc.text("Vendor Payout:", labelX, totalsY + 16);

            doc.setFont("helvetica", "bold");
            doc.setTextColor(textDark[0], textDark[1], textDark[2]);

            const formattedSub = `$${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
            const formattedComm = `-$${totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
            const formattedVendor = `$${(billingInfo.vendorPayment || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
            const formattedNet = `$${(invoiceInfo.invoiceAmount || totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

            doc.text(formattedSub, valueX, totalsY + 6, { align: "right" });
            doc.setTextColor(220, 38, 38); // red color accent for commission deduction
            doc.text(formattedComm, valueX, totalsY + 11, { align: "right" });
            doc.setTextColor(textDark[0], textDark[1], textDark[2]);
            doc.text(formattedVendor, valueX, totalsY + 16, { align: "right" });

            doc.line(110, totalsY + 20, 190, totalsY + 20);
            doc.setFontSize(10);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("Net Ledger Value:", labelX, totalsY + 26);
            doc.text(formattedNet, valueX, totalsY + 26, { align: "right" });

            // 6. Draw Professional Terms & Footer
            const finalY = Math.max(totalsY + 36, 225);
            doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
            doc.line(20, finalY, 190, finalY);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(textDark[0], textDark[1], textDark[2]);
            doc.text("Terms & Conditions:", 20, finalY + 6);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);

            const termsText = "Please review all transaction lines. Settlement terms are Net 30 from the statement date. Synchronized transactions are bound by supply logistics covenants and automatically processed via connected QuickBooks endpoints.";
            const wrappedTerms = doc.splitTextToSize(termsText, 170);
            doc.text(wrappedTerms, 20, finalY + 11);

            // Save PDF directly to local disk
            const fileName = `Invoice_${invoiceInfo.invoiceNumber || invoice?.saleId || 'Statement'}.pdf`;
            doc.save(fileName);

            customToast.success("Invoice PDF successfully downloaded to your local disk!", toastId);
        } catch (err) {
            console.error("PDF generation failed:", err);
            customToast.error("Failed to generate PDF. Falling back to native print options...", toastId);
            window.print();
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader size={40} text="Invoice loading..." />
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center pb-8 animate-in fade-in duration-300">
                <div className="h-16 w-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                    <Briefcase className="h-8 w-8" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-foreground">Failed to Load Invoice</h2>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        {error || "The invoice record you are trying to view could not be found or retrieved."}
                    </p>
                </div>
                <Link href="/finance/dashboard/invoices">
                    <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-background bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-all cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Invoices
                    </button>
                </Link>
            </div>
        );
    }

    const invoiceInfo = (invoice.invoice || {}) as any;
    const billingInfo = (invoice.billing || {}) as any;
    const facilityInfo = (invoice.facility || {}) as any;
    const physicianInfo = (invoice.physician || {}) as any;
    const representativeInfo = (invoice.representatives || {}) as any;
    const creatorInfo = (invoice.createdBy || {}) as any;
    const vendorInfo = (billingInfo.vendor || {}) as any;

    const totalAmount = typeof billingInfo.totalAmount === 'object' ? 0 : Number(billingInfo.totalAmount || 0);
    const totalCommission = typeof representativeInfo.totalCommission === 'object' ? 0 : Number(representativeInfo.totalCommission || 0);

    const statusStr = (invoiceInfo.status || invoice.status || 'unpaid').toUpperCase();
    let statusBadgeType: "success" | "warning" | "error" = "success";
    if (statusStr === 'PENDING' || statusStr === 'UNPAID') statusBadgeType = 'warning';
    if (statusStr === 'REJECTED' || statusStr === 'OVERDUE') statusBadgeType = 'error';

    return (
        <div className="space-y-6 pb-12 animate-in fade-in zoom-in-95 duration-500 print:p-0 print:space-y-0">

            {/* Printable Media Rule Stylesheet */}
            <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          /* Hide normal navigation / headers / sidebar */
          header, sidebar, nav, footer, button, .print\\:hidden {
            display: none !important;
          }
          /* Perfect printable invoice layout */
          .print-area {
            border: none !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .print-text-dark {
            color: #000000 !important;
          }
          .print-text-muted {
            color: #4b5563 !important;
          }
          .print-border {
            border-color: #e5e7eb !important;
          }
        }
      `}</style>

            {/* Top Action Header Panel */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between print:hidden">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full bg-card hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all cursor-pointer active:scale-95"
                    >
                        <ArrowLeft className="h-4 w-4 text-primary" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                            Invoice Statement
                            <span className="text-xs font-mono text-muted-foreground">#{invoiceInfo.invoiceNumber || invoice.saleId}</span>
                        </h1>
                        <p className="text-[11px] text-muted-foreground">
                            Review ledger details, synchronise QuickBooks records, or generate statements.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground bg-card hover:bg-muted border border-border rounded-lg transition-all cursor-pointer dark:shadow-sm active:scale-95"
                    >
                        <Printer className="h-3.5 w-3.5" />
                        Print Statement
                    </button>
                    <button
                        onClick={handleDownloadInvoice}
                        className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-background bg-primary hover:bg-primary/95 rounded-lg dark:shadow-sm transition-all cursor-pointer active:scale-95"
                    >
                        <Download className="h-3.5 w-3.5" />
                        Download Invoice
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 print:grid-cols-1">

                {/* Main Business Invoice Document */}
                <div className="md:col-span-2 space-y-6">
                    <div id="invoice-card" className="print-area rounded-2xl border border-border bg-card/60 backdrop-blur-md dark:shadow-md overflow-hidden transition-all flex flex-col p-6 sm:p-8 space-y-8">

                        {/* Invoice Top Header */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 border-b border-border pb-6 print-border">
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-black tracking-widest text-primary uppercase">H.O.L.E LOGISTICS</span>
                                <h2 className="text-xl font-bold tracking-tight text-foreground print-text-dark">INVOICE STATEMENT</h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground print-text-muted">Status:</span>
                                    <StatusBadge status={statusStr} type={statusBadgeType} />
                                </div>
                            </div>
                            <div className="space-y-1 text-left sm:text-right text-xs text-muted-foreground print-text-muted">
                                <p><span className="font-semibold text-foreground print-text-dark">Invoice ID:</span> {invoiceInfo.invoiceNumber || 'N/A'}</p>
                                <p><span className="font-semibold text-foreground print-text-dark">Sale ID:</span> #{invoice.saleId}</p>
                                <p><span className="font-semibold text-foreground print-text-dark">Date:</span> {invoiceInfo.invoiceDate ? dayjs(invoiceInfo.invoiceDate).format("MMM DD, YYYY") : dayjs(invoice.createdAt).format("MMM DD, YYYY")}</p>
                                <p><span className="font-semibold text-foreground print-text-dark">Due Date:</span> {invoiceInfo.invoiceDate ? dayjs(invoiceInfo.invoiceDate).add(30, 'day').format("MMM DD, YYYY") : 'N/A'}</p>
                            </div>
                        </div>

                        {/* Billed To / Billed By Billing Parties Details */}
                        <div className="grid gap-6 sm:grid-cols-2 text-xs">
                            <div className="space-y-2 p-4 bg-muted/20 border border-border rounded-xl print-border">
                                <p className="text-xs font-semibold text-primary uppercase flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5" />
                                    BILLED TO (FACILITY)
                                </p>
                                <div className="space-y-1 text-muted-foreground print-text-muted">
                                    <p className="font-bold text-foreground text-sm print-text-dark">{facilityInfo.name || 'N/A'}</p>
                                    <p className="font-medium text-foreground print-text-dark">{facilityInfo.contacts || 'Facility Contact'}</p>
                                    <p className="leading-relaxed">{facilityInfo.address || 'Address N/A'}</p>
                                    {facilityInfo.phoneNumber && <p>Phone: {facilityInfo.phoneNumber}</p>}
                                    {facilityInfo.email && <p>Email: {facilityInfo.email}</p>}
                                </div>
                            </div>

                            <div className="space-y-2 p-4 bg-muted/20 border border-border rounded-xl print-border">
                                <p className="text-xs font-semibold text-emerald-500 uppercase flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5" />
                                    PREPARED BY (REPRESENTATIVE)
                                </p>
                                <div className="space-y-1 text-muted-foreground print-text-muted">
                                    <p className="font-bold text-foreground text-sm print-text-dark">{creatorInfo.fullName || 'Representative'}</p>
                                    <p className="font-medium capitalize text-emerald-400">{creatorInfo.role || 'representative'}</p>
                                    <p>Email: {creatorInfo.email || 'N/A'}</p>
                                    {creatorInfo.designation && <p>Company: {creatorInfo.designation}</p>}
                                    {invoice.salesType && <p className="capitalize">Type: {invoice.salesType} Sale</p>}
                                </div>
                            </div>
                        </div>

                        {/* Product Summary Table */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-foreground print-text-dark uppercase">Inventory Products Involved</h3>
                            <div className="border border-border rounded-xl overflow-hidden print-border">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-muted/30 border-b border-border text-muted-foreground font-semibold print-border print-text-muted">
                                            <th className="p-3">PRODUCT ID</th>
                                            <th className="p-3">MODEL / CATEGORY</th>
                                            <th className="p-3">TYPE</th>
                                            <th className="p-3 text-right">STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border print-border">
                                        {invoice.inventoryProducts && invoice.inventoryProducts.length > 0 ? (
                                            invoice.inventoryProducts.map((p: any, idx: number) => {
                                                const prodId = typeof p.product === 'object' ? p.product?._id : p.product;
                                                const model = p.productModel || 'N/A';
                                                const type = p.productType || 'N/A';

                                                let detailLabel = '';
                                                let detailValue = '';
                                                let productStatus = 'active';

                                                if (p.product && typeof p.product === 'object') {
                                                    const prodObj = p.product;
                                                    if (model === 'PurchaseOrder') {
                                                        detailLabel = 'PO Number';
                                                        detailValue = prodObj.purchaseOrderNumber || 'N/A';
                                                        if (prodObj.patientId) {
                                                            detailValue += ` (Patient ID: ${prodObj.patientId})`;
                                                        }
                                                        productStatus = prodObj.status || 'open';
                                                    } else if (model === 'Implant') {
                                                        detailLabel = 'System';
                                                        detailValue = `${prodObj.systemType || 'N/A'} (SN: ${prodObj.serialNumber || 'N/A'})`;
                                                        productStatus = prodObj.productStatus || 'available';
                                                    } else if (model === 'Tray') {
                                                        detailLabel = 'System';
                                                        detailValue = `${prodObj.title || 'N/A'} - ${prodObj.systemType || 'N/A'}`;
                                                        productStatus = prodObj.productStatus || prodObj.status || 'available';
                                                    } else if (model === 'Bio') {
                                                        detailLabel = 'Item Details';
                                                        detailValue = `${prodObj.itemName || 'N/A'} (Lot: ${prodObj.lotNumber || 'N/A'} | Qty: ${prodObj.quantity || 'N/A'})`;
                                                        productStatus = prodObj.productStatus || 'available';
                                                    }
                                                }

                                                return (
                                                    <tr key={idx} className="hover:bg-muted/10 transition-colors">
                                                        <td className="p-3 font-mono text-muted-foreground print-text-muted truncate max-w-[120px]" title={prodId}>
                                                            {prodId || 'N/A'}
                                                        </td>
                                                        <td className="p-3 font-medium text-foreground print-text-dark">
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-foreground print-text-dark">{model}</span>
                                                                {detailValue && (
                                                                    <span className="text-[10px] text-muted-foreground print-text-muted mt-0.5">
                                                                        <strong className="text-foreground/75 dark:text-foreground/60">{detailLabel}: </strong>
                                                                        {detailValue}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-3 text-muted-foreground print-text-muted capitalize">
                                                            {type}
                                                        </td>
                                                        <td className="p-3 text-right">
                                                            <span className={cn(
                                                                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                                                                productStatus === 'available' || productStatus === 'active' || productStatus === 'open'
                                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                                    : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                                            )}>
                                                                {productStatus}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                                    No product records mapped to this invoice statement.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Invoice Total Ledger Calculations */}
                        <div className="flex flex-col sm:flex-row sm:justify-end border-t border-border pt-6 print-border">
                            <div className="w-full sm:w-80 space-y-2.5 text-xs text-muted-foreground print-text-muted">
                                <div className="flex justify-between">
                                    <span>Gross Subtotal:</span>
                                    <span className="font-semibold text-foreground print-text-dark">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Commissions:</span>
                                    <span className="font-semibold text-emerald-500">-${totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Vendor Payout Allocation:</span>
                                    <span className="font-semibold text-foreground print-text-dark">${(billingInfo.vendorPayment || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between border-t border-border pt-2 text-sm text-foreground print-text-dark font-bold print-border">
                                    <span>Net Ledger Value:</span>
                                    <span className="text-primary font-black">${(invoiceInfo.invoiceAmount || totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Business Terms and Notes footer */}
                        <div className="border-t border-border pt-6 text-[10px] text-muted-foreground leading-relaxed print-border print-text-muted">
                            <p className="font-bold text-foreground print-text-dark mb-1">Terms & Conditions:</p>
                            <p>Please review all transaction lines. Settlement terms are Net 30 from the statement date. Synchronized transactions are bound by supply logistics covenants and automatically processed via connected QuickBooks endpoints.</p>
                        </div>

                    </div>
                </div>

                {/* RIGHT: Auxiliary Details Sidebar Panels */}
                <div className="space-y-6 print:hidden">

                    {/* Transaction Metadata & Status Card */}
                    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-5 space-y-4">
                        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <Activity className="h-4 w-4 text-primary animate-pulse" />
                            Statement Ledger
                        </h3>

                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-muted-foreground">Invoice status</span>
                                <StatusBadge status={statusStr} type={statusBadgeType} />
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-muted-foreground">Payment Method</span>
                                <span className="font-bold text-foreground capitalize flex items-center gap-1">
                                    <CreditCard className="h-3.5 w-3.5 text-primary" />
                                    {invoiceInfo.paymentMethod || 'cash'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-muted-foreground">Sales Class</span>
                                <span className="font-semibold text-foreground capitalize">{invoice.salesType || 'consigned'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-muted-foreground">Procedure Date</span>
                                <span className="font-medium text-foreground">
                                    {invoice.procedureDate ? dayjs(invoice.procedureDate).format("MMM DD, YYYY") : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Physician Information Panel */}
                    {physicianInfo._id && (
                        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-5 space-y-4">
                            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                Physician in Charge
                            </h3>

                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center text-primary font-bold">
                                    {physicianInfo.profileUrl ? (
                                        <Image
                                            src={physicianInfo.profileUrl}
                                            alt="physician"
                                            height={40}
                                            width={40}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        physicianInfo.fullName?.charAt(0) || 'D'
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-foreground">{physicianInfo.fullName}</p>
                                    <p className="text-[10px] text-muted-foreground capitalize">{physicianInfo.specialty || 'specialist'}</p>
                                </div>
                            </div>
                            {physicianInfo.noteToSelf && (
                                <div className="p-2.5 bg-muted/30 border border-border rounded-lg text-[10px] text-muted-foreground leading-relaxed">
                                    <span className="font-semibold text-foreground block mb-0.5">Note:</span>
                                    {physicianInfo.noteToSelf}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Logistics Vendor Information Panel */}
                    {vendorInfo._id && (
                        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-5 space-y-4">
                            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <Briefcase className="h-4 w-4 text-primary" />
                                Logistics Vendor
                            </h3>

                            <div className="space-y-3 text-xs">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center text-primary font-bold">
                                        {vendorInfo.profileUrl ? (
                                            <Image
                                                src={vendorInfo.profileUrl}
                                                alt="vendor"
                                                height={40}
                                                width={40}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            vendorInfo.companyName?.charAt(0) || 'V'
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-foreground">{vendorInfo.companyName || 'Vendor Co.'}</p>
                                        <p className="text-[10px] text-muted-foreground">{vendorInfo.name || 'Vendor Contact'}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-border text-[10px] text-muted-foreground">
                                    <p><span className="font-semibold text-foreground">PO Number:</span> {billingInfo.purchaseOrderNumber || 'N/A'}</p>
                                    {vendorInfo.email && <p><span className="font-semibold text-foreground">Email:</span> {vendorInfo.email}</p>}
                                    {vendorInfo.phoneNumber && <p><span className="font-semibold text-foreground">Phone:</span> {vendorInfo.phoneNumber}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}