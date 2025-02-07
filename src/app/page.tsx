import { Header } from "@/components/Header";
import Hero from "@/components/hero-banner"
import Features from "@/components/BrandHighlights"
import News from "@/components/Newsletter"
import Hero2 from "@/components/hero-section"
import Footer from "@/components/PageFooter"
export default function Home() {
  return (
    <>
    <Header/>
    <Hero />
    <Features/>
    <Hero2/>
    <News/>
    <Footer/>
    </>
  )
}
