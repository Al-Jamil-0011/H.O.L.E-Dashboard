'use client';

import {
    FileText,
    Shield,
    Scale,
    AlertTriangle,
    CheckCircle2,
    Globe,
    Ban,
    Mail,
} from 'lucide-react';

const termsSections = [
    {
        icon: CheckCircle2,
        title: 'Acceptance of Terms',
        description:
            'By accessing or using this platform, you agree to comply with all applicable terms, policies, and conditions outlined within this agreement.',
    },
    {
        icon: Shield,
        title: 'User Responsibilities',
        description:
            'Users are responsible for maintaining account security, protecting login credentials, and ensuring that all activities comply with platform policies.',
    },
    {
        icon: Ban,
        title: 'Restricted Activities',
        description:
            'Unauthorized access, misuse of services, harmful activities, or attempts to compromise system integrity are strictly prohibited.',
    },
    {
        icon: Scale,
        title: 'Legal Compliance',
        description:
            'Users must comply with all relevant laws and regulations while using our services and interacting with the platform.',
    },
];

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="space-y-5">
                <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-orange/10 pointer-events-none" />

                    <div className="relative z-10 p-6 md:p-10 lg:p-14">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground mb-5">
                            <FileText className="w-4 h-4 text-primary" />
                            Terms & Conditions
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                                    Terms of Service
                                </h1>

                                <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
                                    These Terms of Service govern your access to
                                    and use of our platform, services, and
                                    digital products. Please review them carefully
                                    before using the system.
                                </p>

                                <div className="flex flex-wrap gap-4 mt-8">
                                    <button className="px-6 py-3 rounded-xl bg-primary text-[#0B101E] font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                                        Read Policy
                                    </button>

                                    <button className="px-6 py-3 rounded-xl border border-border bg-background hover:bg-muted transition-all duration-200 font-medium cursor-pointer">
                                        Contact Legal Team
                                    </button>
                                </div>
                            </div>

                            {/* Right Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    'Secure Usage',
                                    'Policy Compliance',
                                    'Legal Protection',
                                    'Transparent Terms',
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-2xl border border-border bg-background/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                                            <Shield className="w-6 h-6" />
                                        </div>

                                        <p className="font-semibold text-sm md:text-base">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terms Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {termsSections.map((section, idx) => {
                        const Icon = section.icon;

                        return (
                            <div
                                key={idx}
                                className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                                    <Icon className="w-7 h-7" />
                                </div>

                                <h2 className="text-2xl font-bold">
                                    {section.title}
                                </h2>

                                <p className="mt-4 text-muted-foreground leading-relaxed">
                                    {section.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Liability Section */}
                <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-3 rounded-xl bg-accent-red/10 text-accent-red">
                            <AlertTriangle className="w-6 h-6" />
                        </div>

                        <h2 className="text-2xl font-bold">
                            Limitation of Liability
                        </h2>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                        While we strive to maintain reliable and uninterrupted
                        services, we are not responsible for indirect damages,
                        service interruptions, data loss, or third-party issues
                        beyond our reasonable control.
                    </p>
                </div>

                {/* Updates Section */}
                <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-3 rounded-xl bg-accent-blue/10 text-accent-blue">
                            <Globe className="w-6 h-6" />
                        </div>

                        <h2 className="text-2xl font-bold">
                            Updates to Terms
                        </h2>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                        We reserve the right to modify or update these Terms of
                        Service at any time. Continued use of the platform after
                        updates are published constitutes acceptance of the revised
                        terms.
                    </p>
                </div>

                {/* Contact Section */}
                <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent-orange/10 p-8 md:p-12 shadow-sm">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                <Mail className="w-6 h-6" />
                            </div>

                            <h2 className="text-3xl font-bold">
                                Need Assistance?
                            </h2>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">
                            If you have any questions regarding these Terms of
                            Service, legal policies, or compliance matters,
                            please contact our support or legal department.
                        </p>

                        <button className="mt-8 px-8 py-3 rounded-xl bg-primary text-[#0B101E] font-semibold shadow-lg shadow-primary/20 hover:scale-[1.03] transition-all duration-200 cursor-pointer">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}