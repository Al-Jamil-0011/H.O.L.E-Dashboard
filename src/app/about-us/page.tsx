import AboutUs from "@/components/common/about";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | H.O.L.E Dashboard",
  description:
    "Learn more about H.O.L.E Dashboard, our mission, and the team behind the platform. Discover our story, the values that drive us, and our commitment to delivering a secure, reliable, and innovative experience for our users.",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      {/* Main Container */}
      <AboutUs />
    </div>
  );
}
