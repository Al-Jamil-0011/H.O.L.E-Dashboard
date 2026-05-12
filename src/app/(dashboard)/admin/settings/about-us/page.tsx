'use client';

import {
    ShieldCheck,
    Users,
    Target,
    HeartHandshake,
    Sparkles,
    Globe,
} from 'lucide-react';

const stats = [
    {
        title: '10K+',
        description: 'Active Users',
    },
    {
        title: '99%',
        description: 'Client Satisfaction',
    },
    {
        title: '24/7',
        description: 'Support Service',
    },
    {
        title: '50+',
        description: 'Team Members',
    },
];

const values = [
    {
        icon: ShieldCheck,
        title: 'Trust & Security',
        description:
            'We prioritize reliability, privacy, and secure systems to ensure confidence in every interaction.',
    },
    {
        icon: Users,
        title: 'Customer Focus',
        description:
            'Every feature and workflow is designed to create a seamless experience for our users.',
    },
    {
        icon: Sparkles,
        title: 'Innovation',
        description:
            'We continuously improve our technology stack and user experience with modern solutions.',
    },
    {
        icon: HeartHandshake,
        title: 'Strong Partnership',
        description:
            'We believe in building long-term relationships through transparency and collaboration.',
    },
];

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="space-y-5">
                <h1 className="text-2xl font-bold text-foreground">About Us</h1>

                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-purple/10 pointer-events-none" />

                    <div className="relative z-10 p-6 md:p-10 lg:p-14">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground mb-5">
                            <Globe className="w-4 h-4 text-primary" />
                            About Our Company
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                                    Building Modern Digital Solutions
                                    <span className="text-primary"> With Innovation</span>
                                </h1>

                                <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
                                    We are dedicated to creating scalable, efficient,
                                    and user-focused systems that help businesses grow
                                    faster and operate smarter. Our mission is to deliver
                                    high-quality digital experiences powered by modern
                                    technologies and strong collaboration.
                                </p>

                                <div className="flex flex-wrap gap-4 mt-8">
                                    <button className="px-6 py-3 rounded-xl bg-primary text-[#0B101E] font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                                        Learn More
                                    </button>

                                    <button className="px-6 py-3 rounded-xl border border-border bg-background hover:bg-muted transition-all duration-200 font-medium cursor-pointer">
                                        Contact Us
                                    </button>
                                </div>
                            </div>

                            {/* Right Card */}
                            <div className="grid grid-cols-2 gap-4">
                                {stats.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-2xl border border-border bg-background/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <h3 className="text-3xl font-bold text-primary">
                                            {item.title}
                                        </h3>

                                        <p className="mt-2 text-sm text-muted-foreground font-medium">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                <Target className="w-6 h-6" />
                            </div>

                            <h2 className="text-2xl font-bold">
                                Our Mission
                            </h2>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">
                            Our mission is to empower businesses and individuals
                            through innovative technology solutions that improve
                            productivity, efficiency, and digital transformation.
                            We focus on delivering systems that are scalable,
                            secure, and user-friendly.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-accent-purple/10 text-accent-purple">
                                <Sparkles className="w-6 h-6" />
                            </div>

                            <h2 className="text-2xl font-bold">
                                Our Vision
                            </h2>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">
                            We aim to become a globally trusted technology partner
                            known for innovation, quality, and customer success.
                            Our vision is to build future-ready digital ecosystems
                            that create meaningful impact worldwide.
                        </p>
                    </div>
                </div>

                {/* Core Values */}
                <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold">
                            Our Core Values
                        </h2>

                        <p className="mt-2 text-muted-foreground">
                            Principles that guide our work, culture, and innovation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        {values.map((item, idx) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={idx}
                                    className="group rounded-2xl border border-border bg-background p-5 hover:border-primary/40 hover:shadow-md transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    <h3 className="text-lg font-semibold">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="rounded-3xl border border-border bg-linear-to-br from-primary/10 via-card to-accent-blue/10 p-8 md:p-12 text-center shadow-sm">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Let’s Build Something Amazing Together
                    </h2>

                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
                        We combine creativity, technology, and strategy to deliver
                        high-performance digital experiences tailored to your goals.
                    </p>

                    <button className="mt-8 px-8 py-3 rounded-xl bg-primary text-[#0B101E] font-semibold shadow-lg shadow-primary/20 hover:scale-[1.03] transition-all duration-200 cursor-pointer">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
}