import { cn } from "@/lib/utils";
import { IUserStatCardProps, StatInfoCardProps } from "./interface";

export function DashboardStatCard({
    title,
    value,
    trend,
    trendType,
    topBorderColor,
    loading = false
}: {
    title: string;
    value: string;
    trend: string;
    trendType: 'up' | 'down' | 'neutral';
    topBorderColor: string;
    loading?: boolean;
}) {
    return (
        <div className={cn("rounded-xl border border-border border-t-[3px] bg-card p-5 dark:shadow-sm transition-all hover:bg-muted/50", topBorderColor)}>
            {loading ? (
                <div className="animate-pulse">
                    <div className="h-3 w-24 rounded bg-muted" />
                    <div className="mt-3 h-8 w-28 rounded bg-muted" />
                    <div className="mt-2 h-3 w-20 rounded bg-muted" />
                </div>
            ) : (
                <>
                    <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        {title}
                    </h3>

                    <div className="mt-3">
                        <div className="text-2xl font-black tracking-tight text-foreground">
                            {value}
                        </div>

                        <p className="mt-2 text-[11px] font-medium text-muted-foreground">
                            {trendType === 'up' && (
                                <span className="text-primary font-semibold">{trend}</span>
                            )}

                            {trendType === 'down' && (
                                <span className="text-rose-500 font-semibold">{trend}</span>
                            )}

                            {trendType === 'neutral' && (
                                <span className="text-emerald-400 font-semibold">{trend}</span>
                            )}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}

export function StatInfoCard({
    icon,
    label,
    value,
    valuePrefix = "",
    valueSuffix = "",
    iconClass = "",
    loading = false,
}: StatInfoCardProps) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/20 border border-border dark:shadow-sm relative overflow-hidden group hover:bg-muted/30 transition-colors">

            {loading && (
                <div className="absolute inset-0 bg-card animate-pulse p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted" />
                    <div className="flex-1 space-y-2">
                        <div className="h-2 w-24 bg-muted rounded" />
                        <div className="h-4 w-16 bg-muted rounded" />
                    </div>
                </div>
            )}

            {/* Icon */}
            <div className={cn("p-2 rounded-lg", iconClass)}>
                {icon}
            </div>

            {/* Content */}
            <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {label}
                </p>

                <p className="text-lg font-black text-foreground">
                    {valuePrefix}
                    {value}
                    {valueSuffix}
                </p>
            </div>
        </div>
    );
}

export function UserStatCard({
    title,
    value,
    topBorderColor,
    loading = false,
}: IUserStatCardProps) {
    return (
        <div
            className={cn(
                "rounded-xl border border-border border-t-[3px] bg-card p-5 dark:shadow-sm transition-all hover:bg-muted/30",
                topBorderColor
            )}
        >
            <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {title}
            </h3>

            <div className="mt-2 flex items-center justify-between">
                {loading ? (
                    <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
                ) : (
                    <div className="text-3xl font-black tracking-tight text-foreground">
                        {value}
                    </div>
                )}
            </div>
        </div>
    );
}

export function ExpensesStatCard({
    title,
    amount,
    subtitle,
    subtitleColor,
    borderColor,
    glowColor,
    isLoading
}: {
    title: string,
    amount: string,
    subtitle: string,
    subtitleColor: string,
    borderColor: string,
    glowColor?: string,
    isLoading?: boolean
}) {
    return (
        <div className={cn("rounded-xl border border-border border-t-[3px] bg-card p-5 dark:shadow-sm transition-all hover:bg-muted/30", borderColor, glowColor)}>
            <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{title}</h3>
            {isLoading ? (
                <div className="mt-2 space-y-2">
                    <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </div>
            ) : (
                <>
                    <div className="mt-2 text-3xl font-black tracking-tight text-foreground">{amount}</div>
                    <p className={cn("mt-1 text-xs font-medium", subtitleColor)}>{subtitle}</p>
                </>
            )}
        </div>
    )
}

export function SalesStatCard({
    title,
    value,
    trend,
    topBorderColor,
    loading = false
}: {
    title: string;
    value: string;
    trend: string;
    topBorderColor: string;
    loading?: boolean;
}) {
    return (
        <div
            className={cn(
                "rounded-xl border border-border border-t-[3px] bg-card p-5 dark:shadow-sm transition-all hover:bg-muted/30",
                topBorderColor
            )}
        >
            <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {title}
            </h3>

            <div className="mt-3 space-y-2">
                {loading ? (
                    <div className="h-7 w-24 rounded-md bg-muted animate-pulse" />
                ) : (
                    <div className="text-2xl font-black tracking-tight text-foreground">
                        {value}
                    </div>
                )}

                {loading ? (
                    <div className="h-3 w-20 rounded-md bg-muted animate-pulse" />
                ) : (
                    <p className="text-[11px] font-medium text-primary">
                        {trend}
                    </p>
                )}
            </div>
        </div>
    );
}

export function CommissionStatCard({
    title,
    value,
    trend,
    topBorderColor,
    trendColor = "text-primary",
    loading = false
}: {
    title: string;
    value: string;
    trend: string;
    topBorderColor: string;
    trendColor?: string;
    loading?: boolean;
}) {
    return (
        <div
            className={cn(
                "rounded-xl border border-border border-t-[3px] bg-card p-5 dark:shadow-sm transition-all hover:bg-muted/30",
                topBorderColor
            )}
        >
            <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {title}
            </h3>

            <div className="mt-3 space-y-2">
                {loading ? (
                    <div className="h-7 w-24 rounded-md bg-muted animate-pulse" />
                ) : (
                    <div className="text-2xl font-black tracking-tight text-foreground">
                        {value}
                    </div>
                )}

                {loading ? (
                    <div className="h-3 w-20 rounded-md bg-muted animate-pulse" />
                ) : (
                    <p className={cn("mt-2 text-[11px] font-medium", trendColor)}>
                        {trend}
                    </p>
                )}
            </div>
        </div>
    );
}

export function InventoryStatCard({
    title,
    value,
    icon,
    textColor = "text-foreground",
    topBorderColor,
    highlight = false,
    loading = false,
}: {
    title: string,
    value: string | number,
    icon: React.ReactNode,
    textColor?: string,
    topBorderColor: string,
    highlight?: boolean,
    loading?: boolean,
}) {
    return (
        <div
            className={cn(
                "rounded-xl border border-border border-t-[3px] bg-card p-5 dark:shadow-sm transition-all hover:bg-muted/30 relative overflow-hidden",
                topBorderColor,
                highlight &&
                "animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.2)] border-rose-500/50"
            )}
        >
            {highlight && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl pointer-events-none rounded-full" />
            )}

            <div className="flex items-start justify-between">
                <div>
                    {loading ? (
                        <>
                            <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                            <div className="mt-3 h-8 w-16 rounded bg-muted animate-pulse" />
                        </>
                    ) : (
                        <>
                            <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                {title}
                            </h3>

                            <div
                                className={cn(
                                    "mt-2 text-3xl font-black tracking-tight",
                                    textColor
                                )}
                            >
                                {value}
                            </div>
                        </>
                    )}
                </div>

                <div className="p-2 bg-muted rounded-lg border border-border">
                    {loading ? (
                        <div className="h-5 w-5 rounded bg-muted animate-pulse" />
                    ) : (
                        icon
                    )}
                </div>
            </div>
        </div>
    );
}