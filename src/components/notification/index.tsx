"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaBell, FaCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useNotificationService } from "@/hooks/notifications";
import Loader from "../loader";
import { ArrowLeft, MoreHorizontal, UserCircle2 } from "lucide-react";
import { INotification } from "@/hooks/notifications/interface";

dayjs.extend(relativeTime);

const NotificationItem = ({ notification }: { notification: INotification }) => {
    const { title, createdAt, isRead, is_read, sender, description } = notification;

    const isActuallyRead = isRead !== undefined ? isRead : is_read;

    return (
        <div
            className={`flex items-start px-5 py-3 transition duration-200 hover:bg-muted/50 group relative animate-in fade-in slide-in-from-bottom-2 duration-300 ${!isActuallyRead ? "bg-primary/5 dark:bg-primary/10" : "bg-card"
                }`}
        >
            {!isActuallyRead && (
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2">
                    <FaCircle className="text-primary w-2 h-2 animate-pulse" />
                </div>
            )}

            <div className="shrink-0 mr-4 relative">
                <div className="relative w-12 h-12">
                    {sender?.profileUrl ? (
                        <Image
                            src={sender?.profileUrl}
                            alt={sender?.name || "User"}
                            fill
                            className="rounded-full object-cover border border-background dark:shadow-sm"
                        />
                    ) : (
                        <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center border border-border text-primary font-bold text-sm uppercase">
                            {sender?.name
                                ? sender.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)
                                : "SY"}
                        </div>
                    )}

                </div>
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 border border-background dark:ow-sm">
                    <FaBell className="w-2.5 h-2.5 text-white" />
                </div>
            </div>

            <div className="grow pr-8">
                <p className={`text-foreground leading-snug text-sm ${!isActuallyRead ? "font-bold" : "font-medium"}`}>
                    {title}
                </p>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                )}

                <div className="flex items-center gap-2 mt-2.5">
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                        {sender?.name || "System"}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <p className="text-muted-foreground text-xs font-medium">
                        {dayjs(createdAt).fromNow()}
                    </p>
                </div>
            </div>
            {/* 
            <button className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-background transition-all absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-5 h-5" />
            </button> */}
        </div>
    );
};


export default function Notifications() {
    const router = useRouter();
    const {
        loading,
        fetchAllNotifications,
    } = useNotificationService();

    const [currentPage, setCurrentPage] = useState(1);
    const [allNotifications, setAllNotifications] = useState<INotification[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const isInitialMount = useRef(true);

    // Unified function to fetch and accumulate notifications
    const loadData = useCallback(async (page: number) => {
        // Defer execution to avoid synchronous setState warning in useEffect
        await Promise.resolve();

        const data = await fetchAllNotifications(page, 10);

        if (data) {
            const results = data.results || [];
            const pagination = data.pagination;

            setAllNotifications((prev) => {
                // If we are on page 1, reset the list
                if (page === 1) return results;

                // For pagination, filter out potential duplicates and append
                const existingIds = new Set(prev.map(n => n._id));
                const newItems = results.filter(n => !existingIds.has(n._id));
                return [...prev, ...newItems];
            });

            // Update hasMore status directly from the fresh pagination data
            if (pagination) {
                setHasMore(page < pagination.totalPage);
            }
        } else if (page === 1) {
            // Handle initial failure
            setAllNotifications([]);
            setHasMore(false);
        }
    }, [fetchAllNotifications]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            setTimeout(() => {
                loadData(1);
            }, 0);
        }
    }, [loadData]);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastNotificationRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setCurrentPage((prev) => {
                        const nextPage = prev + 1;
                        loadData(nextPage);
                        return nextPage;
                    });
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore, loadData]
    );

    return (
        <div className="bg-background pb-8">
            <div className="bg-card rounded-3xl border border-border overflow-hidden transition-all duration-300">
                {/* Header Section */}
                <header className="py-6 border-b border-border bg-muted backdrop-blur-xl sticky top-0 z-20">
                    <div className="ml-5">
                        <h1 className="title mb-1">
                            Notifications
                        </h1>
                        <p className="text-xs text-muted-foreground font-medium">
                            Stay updated with your latest alerts and account activities
                        </p>
                    </div>
                </header>

                {/* Notifications List */}
                <div className="divide-y divide-border">
                    {allNotifications.map((notification, index) => {
                        const isLast = allNotifications.length === index + 1;

                        return (
                            <div
                                key={notification._id || `notification-${index}`}
                                ref={isLast ? lastNotificationRef : null}
                            >
                                <NotificationItem notification={notification} />
                            </div>
                        );
                    })}

                    {/* Loading Indicator */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center w-full py-16 bg-card">
                            <Loader size={32} text="Fetching more notifications..." />
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && allNotifications.length === 0 && (
                        <div className="py-40 text-center bg-card animate-in zoom-in-95 duration-500">
                            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-muted/50 mb-8">
                                <FaBell className="w-12 h-12 text-muted-foreground/20" />
                            </div>
                            <h4 className="text-2xl font-bold text-foreground">
                                All caught up!
                            </h4>
                            <p className="text-muted-foreground mt-3 max-w-sm mx-auto text-base">
                                You&apos;don&apos;t have any notifications at the moment. We&apos;ll let you know when something happens.
                            </p>
                        </div>
                    )}

                    {/* End of List Message */}
                    {!hasMore && allNotifications.length > 0 && !loading && (
                        <div className="p-12 text-center text-muted-foreground/50 text-sm font-semibold tracking-wide uppercase bg-muted/5">
                            You&apos;ve reached the end of your notifications
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}