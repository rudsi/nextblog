import Header from "@/components/Header";
import Hero from "@/components/hero/Hero";
import PaginationSection from "@/components/body/PaginationSection";

export default function Home() {
  return (
    <div className="gap-5">
      <Header />
      <Hero />
      <PaginationSection />  
    </div>
  );
}
