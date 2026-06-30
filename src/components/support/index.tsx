"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  Mail,
  Phone,
  MessageCircle,
  Clock,
  LifeBuoy,
  Send,
  CheckCircle2,
  User,
  Loader2,
} from "lucide-react";
import FormField from "@/components/form";

const SUPPORT_EMAIL = "support@example.com";
const SUPPORT_PHONE = "+1 (234) 567-890";

const faqs = [
  {
    q: "What are your support hours?",
    a: "Our team is available Monday through Friday, 9:00 AM – 6:00 PM (EST). We aim to respond to all inquiries within 24 hours on business days.",
  },
  {
    q: "How quickly will I get a response?",
    a: "Most email inquiries receive a reply within 24 hours. Urgent issues submitted via phone are typically addressed the same business day.",
  },
  {
    q: "Can I request a refund?",
    a: "Yes. Refund requests can be submitted via the form below or by emailing our support team directly. Please include your order or account ID.",
  },
  {
    q: "How do I report a bug?",
    a: "Use the contact form below and select the appropriate topic. Include steps to reproduce, screenshots, and your browser/device details.",
  },
  {
    q: "Do you offer enterprise support?",
    a: "Yes, we offer dedicated support plans for enterprise customers, including a dedicated account manager and priority response SLAs.",
  },
];

export default function SupportContent() {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);

  // Set up react-hook-form
  const methods = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const onSubmit = async (data: any) => {
    setLoading(true);
    // Implement your API submission endpoint logic here
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
      setSubmitted(true);
      reset();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-accent/30" />
        <div className="mx-auto max-w-6xl px-6 py-20 text-center sm:py-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <LifeBuoy className="h-3.5 w-3.5" />
            Support Center
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            How can we help you?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Our team is here to answer questions, resolve issues, and help you
            get the most out of our product.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Contact cards */}
        <section className="grid gap-6 sm:grid-cols-3">
          <ContactCard
            icon={<Mail className="h-5 w-5" />}
            label="Email us"
            value={SUPPORT_EMAIL}
            href={`mailto:${SUPPORT_EMAIL}`}
            hint="Replies within 24 hours"
          />
          <ContactCard
            icon={<Phone className="h-5 w-5" />}
            label="Call us"
            value={SUPPORT_PHONE}
            href={`tel:${SUPPORT_PHONE.replace(/[^+\d]/g, "")}`}
            hint="Mon–Fri, 9 AM – 6 PM EST"
          />
          <ContactCard
            icon={<Clock className="h-5 w-5" />}
            label="Live status"
            value="All systems operational"
            hint="Updated in real time"
          />
        </section>

        <section className="mt-16 grid gap-10">
          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Send us a message
                </h2>
                <p className="text-sm text-muted-foreground">
                  We'll get back to you as soon as possible.
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-accent/30 px-6 py-12 text-center">
                <CheckCircle2 className="h-10 w-10 text-primary" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Message sent
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Thanks for reaching out. A member of our support team will
                  reply to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 cursor-pointer text-sm font-medium text-primary hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      type="text"
                      name="fullName"
                      label="Full name"
                      placeholder="Jane Doe"
                      icon={<User className="h-5 w-5" />}
                      register={register}
                      errors={errors}
                      validation={{ required: "Full name is required" }}
                    />
                    <FormField
                      type="email"
                      name="email"
                      label="Email address"
                      placeholder="jane@example.com"
                      icon={<Mail className="h-5 w-5" />}
                      register={register}
                      errors={errors}
                      validation={{
                        required: "Email is required",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Invalid email format",
                        },
                      }}
                    />
                  </div>

                  <FormField
                    type="select"
                    name="topic"
                    label="Topic"
                    placeholder="Select a topic"
                    options={[
                      {
                        label: "General question",
                        value: "General question",
                      },
                      {
                        label: "Billing & refunds",
                        value: "Billing & refunds",
                      },
                      { label: "Technical issue", value: "Technical issue" },
                      { label: "Feature request", value: "Feature request" },
                      { label: "Other", value: "Other" },
                    ]}
                    register={register}
                    errors={errors}
                    validation={{ required: "Topic is required" }}
                  />

                  <FormField
                    type="textarea"
                    name="message"
                    label="Message"
                    placeholder="Tell us how we can help…"
                    register={register}
                    errors={errors}
                    validation={{ required: "Message is required" }}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="float-right inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-primary/90 sm:w-auto disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send message
                      </span>
                    )}
                  </button>
                </form>
              </FormProvider>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-20 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/40 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Still need help?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Reach out directly — we're a small team and we read every message.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground  transition-colors hover:bg-primary/90"
            >
              <Mail className="h-4 w-4" />
              {SUPPORT_EMAIL}
            </a>
            <a
              href={`tel:${SUPPORT_PHONE.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Phone className="h-4 w-4" />
              {SUPPORT_PHONE}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  hint: string;
}) {
  const content = (
    <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all hover:border-ring/40 ">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}
