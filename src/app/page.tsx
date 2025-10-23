import Header from "@/components/Header";
import Hero from "@/components/hero/Hero";
import PaginationSection from "@/components/body/PaginationSection";
import AppInitializer from "@/components/Initializer";

export default function Home() {
  return (
    <AppInitializer>
      <Header />
      <Hero />
      <PaginationSection />  
    </AppInitializer>
  );
}
