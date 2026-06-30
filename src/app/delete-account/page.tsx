import DeleteAccount from "@/components/common/delete-account";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Account | H.O.L.E Dashboard",
  description:
    "Permanently delete your H.O.L.E Dashboard account and associated data. Learn what happens when you close your account, which information is removed, and the steps to confirm your request securely.",
};

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      {/* Main Container */}
      <DeleteAccount />
    </div>
  );
}
