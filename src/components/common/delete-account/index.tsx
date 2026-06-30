"use client";

import { Button } from "@/components/ui/Button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Image from "next/image";
import findDelete from "@/assets/find-delete1.png";
import viewDelete from "@/assets/view-delete.png";
import deleteConfirmation from "@/assets/delete-confirmation.png";

const steps = [
  {
    number: 1,
    title: "Open your profile",
    description:
      "Log in to the NRON app to reach the Home screen. In the bottom navigation bar, tap the profile icon located at the bottom-right corner to open your profile.",
    image: null,
  },
  {
    number: 2,
    title: "Find the Delete Account option",
    description:
      "On your profile page, scroll down to the bottom of the screen. You will find the account management options highlighted in the area marked below.",
    image: findDelete,
    imageAlt: "Profile screen showing where to find the account options",
  },
  {
    number: 3,
    title: "Tap “Delete Account”",
    description:
      "From the highlighted options, tap the “Delete Account” button to begin the account deletion process.",
    image: viewDelete,
    imageAlt: "Profile screen showing the Delete Account option",
  },
  {
    number: 4,
    title: "Confirm the deletion",
    description:
      "A confirmation dialog will appear asking you to confirm your request. Tap “OK” to permanently delete your account. Once confirmed, your account and associated data will be removed and you will see a success message.",
    image: deleteConfirmation,
    imageAlt: "Delete account confirmation dialog",
  },
];

export default function DeleteAccount() {
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
          Delete Account
        </h1>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <span>
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Intro */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-4">Introduction</h2>
        <p className="text-muted-foreground leading-relaxed">
          We&apos;re sorry to see you go. If you wish to permanently delete your
          NRON account, you can do so directly from the mobile app by following
          the steps below. Please note that deleting your account is permanent
          and will remove your profile and associated data. This action cannot
          be undone.
        </p>
      </section>

      {/* Warning */}
      <div className="mb-12 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Important:</strong> Once your
          account is deleted, all of your personal information, activity
          history, and saved preferences will be permanently erased and cannot
          be recovered.
        </p>
      </div>

      {/* Step-by-step guide */}
      <h2 className="text-xl font-bold text-foreground mb-8">
        How to Delete Your Account
      </h2>

      <ol className="space-y-12">
        {steps.map((step) => (
          <li key={step.number} className="flex flex-col gap-5 sm:flex-row">
            {/* Step number */}
            <div className="shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                {step.number}
              </div>
            </div>

            {/* Step content */}
            <div className="flex-1 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {step.image && (
                <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
                  <Image
                    src={step.image}
                    alt={step.imageAlt ?? "step-image"}
                    className="mx-auto h-auto w-full max-w-xs object-contain"
                    placeholder="blur"
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* Success note */}
      <div className="mt-12 rounded-lg border border-border bg-muted/30 p-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          That&apos;s it!
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          After confirming, your account will be deleted successfully. If you
          run into any issues during the process or need further assistance,
          please contact our support team and we&apos;ll be happy to help.
        </p>
      </div>
    </div>
  );
}
