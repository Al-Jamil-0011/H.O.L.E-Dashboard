import PrivacyPolicy from "@/components/common/privacy-policy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | H.O.L.E Dashboard",
  description:
    "Read the H.O.L.E Dashboard Privacy Policy to understand how we collect, use, store, and protect your personal information. Learn about your data rights, our security practices, and our commitment to safeguarding your privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      {/* Main Container */}
      <PrivacyPolicy />
    </div>
  );
}
