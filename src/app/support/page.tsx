import SupportContent from "@/components/support";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Support | H.O.L.E App",
  description:
    "Get in touch with the H.O.L.E App support team. We are here to help with your questions and technical inquiries.",
};

export default function SupportPage() {
  return <SupportContent />;
}
