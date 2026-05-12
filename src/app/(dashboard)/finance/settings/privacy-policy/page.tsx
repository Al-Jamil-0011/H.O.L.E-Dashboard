'use client';

import {
    Shield,
    Lock,
    Database,
    Eye,
    FileCheck,
    Globe,
    Mail,
    CheckCircle2,
} from 'lucide-react';

const policySections = [
    {
        icon: Database,
        title: 'Information We Collect',
        description:
            'We may collect personal information such as name, email address, phone number, account details, and usage activity to improve our services and user experience.',
    },
    {
        icon: Lock,
        title: 'How We Protect Data',
        description:
            'Your information is protected using industry-standard security practices including encryption, secure servers, and restricted access controls.',
    },
    {
        icon: Eye,
        title: 'How We Use Information',
        description:
            'Collected data is used to operate services, improve performance, provide support, process transactions, and communicate important updates.',
    },
    {
        icon: Globe,
        title: 'Third-Party Services',
        description:
            'We may use trusted third-party providers for analytics, payment processing, or infrastructure support while maintaining strict privacy standards.',
    },
];

const highlights = [
    'Secure and encrypted data handling',
    'Transparent privacy practices',
    'No unauthorized sharing of personal data',
    'User-focused data protection policies',
];

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground pb-10">
            <div className="space-y-5">
                <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>

                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-blue/10 pointer-events-none" />

                    <div className="relative z-10 p-6 md:p-10 lg:p-14">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground mb-5">
                            <Shield className="w-4 h-4 text-primary" />
                            Privacy & Security
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                                    Your Privacy Is
                                    <span className="text-primary"> Our Priority</span>
                                </h1>

                                <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
                                    We are committed to protecting your personal
                                    information and maintaining transparency about
                                    how your data is collected, used, and secured.
                                    This Privacy Policy explains our practices and
                                    your rights regarding your information.
                                </p>

                                <div className="flex flex-wrap gap-4 mt-8">
                                    <button className="px-6 py-3 rounded-xl bg-primary text-[#0B101E] font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                                        Learn More
                                    </button>

                                    <button className="px-6 py-3 rounded-xl border border-border bg-background hover:bg-muted transition-all duration-200 font-medium cursor-pointer">
                                        Contact Support
                                    </button>
                                </div>
                            </div>

                            {/* Security Card */}
                            <div className="rounded-3xl border border-border bg-background/70 backdrop-blur-sm p-6 md:p-8 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                        <FileCheck className="w-6 h-6" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold">
                                            Privacy Highlights
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            Key commitments we provide to users
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {highlights.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
                                        >
                                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />

                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Policy Sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {policySections.map((section, idx) => {
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

                {/* Detailed Policy */}
                <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold">
                            Detailed Privacy Policy
                        </h2>

                        <p className="mt-2 text-muted-foreground">
                            Please review the following terms carefully.
                        </p>
                    </div>

                    <div className="space-y-8">

                        <div>
                            <h3 className="text-xl font-semibold mb-3">
                                1. Data Collection
                            </h3>

                            <p className="text-muted-foreground leading-relaxed">
                                We collect only the information necessary to provide
                                and improve our services. This may include account
                                details, communication information, and usage data.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-3">
                                2. Data Usage
                            </h3>

                            <p className="text-muted-foreground leading-relaxed">
                                Information collected is used to maintain platform
                                functionality, improve performance, provide customer
                                support, and enhance user experience.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-3">
                                3. Data Security
                            </h3>

                            <p className="text-muted-foreground leading-relaxed">
                                We implement security measures to safeguard user
                                information from unauthorized access, disclosure,
                                alteration, or destruction.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-3">
                                4. User Rights
                            </h3>

                            <p className="text-muted-foreground leading-relaxed">
                                Users may request access, modification, or deletion
                                of their personal data according to applicable laws
                                and platform policies.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent-purple/10 p-8 md:p-12 shadow-sm">
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
                            If you have questions regarding our privacy practices,
                            security measures, or data policies, please contact our
                            support team for assistance.
                        </p>

                        <button className="mt-8 px-8 py-3 rounded-xl bg-primary text-[#0B101E] font-semibold shadow-lg shadow-primary/20 hover:scale-[1.03] transition-all duration-200 cursor-pointer">
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}