"use client";

import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Loader from "@/components/loader";
import "suneditor/dist/css/suneditor.min.css";
import { useTerms } from "@/hooks/settings";

export default function TermsOfService() {
  const { terms, loading } = useTerms();

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader size={40} text="Loading terms of service..." />
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
          Terms of Services
        </h1>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <span>
            Last Updated:{" "}
            {terms[0]?.published ??
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
          dangerouslySetInnerHTML={{ __html: terms[0]?.content ?? "" }}
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
    </div>
  );
}
