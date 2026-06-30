import TermsOfService from "@/components/common/terms-of-service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | H.O.L.E Dashboard",
  description:
    "Review the H.O.L.E Dashboard Terms of Service governing your use of our platform. Understand your rights and responsibilities, account usage guidelines, acceptable use policies, and the terms that apply when accessing our services.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      {/* Main Container */}
      <TermsOfService />
    </div>
  );
}
