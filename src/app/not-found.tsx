import { Home, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GoBackButton } from "@/components/ui/GoBackButton";

export default function NotFound() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
            {/* Professional Background Effects */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full opacity-20 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }}
                />
                <div
                    className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }}
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />
            </div>

            <section className="relative z-10 mx-auto w-full max-w-2xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur-md dark:shadow-sm">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    System Error 404
                </div>

                <div className="relative mt-8">
                    <h1 className="bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-[clamp(6rem,20vw,12rem)] font-black leading-none tracking-tighter text-transparent select-none">
                        404
                    </h1>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[80px] -z-10" />
                </div>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Resource Not Located
                </h2>
                <p className="mx-auto mt-4 max-w-md text-balance text-sm leading-relaxed text-muted-foreground sm:text-lg">
                    The requested page might have been moved, deleted, or does not exist.
                    Let&apos;s get you back to the system dashboard.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Button asChild>
                        <Link href="/admin/dashboard" className="cursor-pointer text-xs">
                            <Home className="mr-2 h-4 w-4" />
                            Return to Dashboard
                        </Link>
                    </Button>
                    <GoBackButton />
                </div>

                {/* System Directory Links 
                <div className="mx-auto mt-16 grid max-w-xl gap-4 sm:grid-cols-2">
                    <Link
                        href="/admin/dashboard"
                        className="group flex items-start gap-4 rounded-2xl border border-border bg-card/40 p-5 text-left backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="rounded-xl bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary group-hover:text-background">
                            <Compass className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-foreground">
                                System Overview
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground leading-snug">
                                Navigate back to the main administrative dashboard.
                            </div>
                        </div>
                    </Link>
                    
                    <a
                        href="mailto:support@hole-app.com"
                        className="group flex items-start gap-4 rounded-2xl border border-border bg-card/40 p-5 text-left backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="rounded-xl bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary group-hover:text-background">
                            <Search className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-foreground">
                                Support Channel
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground leading-snug">
                                Report a broken link or request technical assistance.
                            </div>
                        </div>
                    </a>
                </div>*/}
            </section>
        </main>
    );
}
