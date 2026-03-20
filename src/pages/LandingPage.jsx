import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Stats from '../components/Stats'
import Pricing from '../components/Pricing'
import Cta from '../components/Cta'
import WhatsAppButton from '../components/WhatsAppButton'
import Footer from '../components/Footer'
import { routes } from '../utils/routes'

export default function LandingPage() {
  return (
    <>
      <Navbar currentPath={routes.home} />
      <main>
        <Hero />
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-20 lg:px-8">
          <Features />
          <Stats />
          <Pricing />
        </div>
        <Cta />
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  )
}
