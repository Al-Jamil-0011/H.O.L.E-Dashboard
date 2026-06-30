"use client";

import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Loader from "@/components/loader";
import "suneditor/dist/css/suneditor.min.css";
import { usePrivacyPolicy } from "@/hooks/settings";

export default function PrivacyPolicy() {
  const { policies, loading } = usePrivacyPolicy();

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader size={40} text="Loading privacy policy..." />
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16">
      {/* Header Section */}
      <div className="mb-10">
        <Button
          variant="link"
          className="pl-0 mb-4 text-primary hover:text-primary/80 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Privacy Policy
        </h1>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <span>
            Last Updated:{" "}
            {policies[0]?.published ??
              new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
          </span>
        </div>
      </div>
      <div className="relative overflow-hidden p-4">
        <div
          className=""
          dangerouslySetInnerHTML={{ __html: policies[0]?.content ?? "" }}
        />
      </div>
      {/* Ensure the rich-text content respects the current theme colors as a fallback, but allows inline styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
                .sun-editor-editable {
                    color: var(--foreground);
                    font-family: inherit;
                }
                .sun-editor-editable h1, 
                .sun-editor-editable h2, 
                .sun-editor-editable h3, 
                .sun-editor-editable h4, 
                .sun-editor-editable h5, 
                .sun-editor-editable h6 {
                    color: var(--foreground);
                }
                /* Use inherit to allow inline colors to work while defaulting to theme color */
                .sun-editor-editable p, .sun-editor-editable span {
                    color: inherit;
                }
                
                /* Standardize some basic HTML styles that might be reset by tailwind */
                .sun-editor-editable ul {
                    list-style-type: disc !important;
                    padding-left: 2rem !important;
                    margin: 1rem 0 !important;
                }
                .sun-editor-editable ol {
                    list-style-type: decimal !important;
                    padding-left: 2rem !important;
                    margin: 1rem 0 !important;
                }
                .sun-editor-editable blockquote {
                    border-left: 4px solid var(--border) !important;
                    padding-left: 1rem !important;
                    margin: 1rem 0 !important;
                    font-style: italic !important;
                    opacity: 0.8 !important;
                }
                .sun-editor-editable table {
                    border-collapse: collapse !important;
                    width: 100% !important;
                    margin: 1rem 0 !important;
                }
                .sun-editor-editable td, .sun-editor-editable th {
                    border: 1px solid var(--border) !important;
                    padding: 0.5rem !important;
                }
            `,
        }}
      />
      {/* Policy Content */}
      {/* <div className="space-y-10">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            1. Introduction
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to NRON. This Privacy Policy describes how NRON ("we", "us",
            or "our") collects, uses, and protects your personal information
            when you use our mobile application and related services
            (collectively, the "Service").
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            2. Information We Collect
          </h2>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We collect information to provide and improve our Service to you.
              The types of information we collect include:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <strong>Personal Information:</strong> Name, email address,
                  phone number, profile picture.
                </div>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <strong>Location Data:</strong> Precise or approximate
                  location data from your mobile device.
                </div>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <strong>Usage Information:</strong> Information about how you
                  access and use the Service, including IP address, device type,
                  and app usage patterns.
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            3. How We Use Your Information
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use the collected information for the following purposes:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>To provide, maintain, and improve our Service.</div>
            </li>
            <li className="flex items-start gap-3 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>To personalize your experience and recommendations.</div>
            </li>
            <li className="flex items-start gap-3 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                To send you updates, notifications, and marketing communications
                (where permitted).
              </div>
            </li>
            <li className="flex items-start gap-3 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>To enhance the security and safety of our Service.</div>
            </li>
            <li className="flex items-start gap-3 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>To comply with legal obligations and resolve disputes.</div>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            4. Sharing Your Information
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We may share your information in the following circumstances:
          </p>
          <ul className="space-y-3 mt-4">
            <li className="flex items-start gap-3 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>With your consent or at your direction.</div>
            </li>
            <li className="flex items-start gap-3 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                With third-party service providers who perform services on our
                behalf.
              </div>
            </li>
            <li className="flex items-start gap-3 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                To comply with legal requirements or respond to legal requests.
              </div>
            </li>
            <li className="flex items-start gap-3 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                In connection with a merger, acquisition, or sale of assets.
              </div>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            5. Data Security
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement reasonable administrative, technical, and physical
            safeguards designed to protect your information from unauthorized
            access, use, or disclosure. However, no method of transmission over
            the internet or electronic storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            6. Your Choices and Rights
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            You may have certain rights regarding your personal information,
            including:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>Accessing and updating your profile information.</div>
            </li>
            <li className="flex items-start gap-3 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>Managing your notification preferences.</div>
            </li>
          </ul>
        </section>
      </div> */}
    </div>
  );
}
