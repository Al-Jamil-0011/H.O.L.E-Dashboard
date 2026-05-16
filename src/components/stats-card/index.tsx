import { cn } from "@/lib/utils";

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