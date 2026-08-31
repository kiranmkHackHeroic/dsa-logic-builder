import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface FeatureLayoutProps {
  children: ReactNode;
}

const FeatureLayout = ({ children }: FeatureLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default FeatureLayout;
