import { Header } from "@/components/layout/header";
import { Hero } from "@/components/layout/hero";
import { Features } from "@/components/layout/features";
import { Newsletter } from "@/components/layout/newsletter";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
