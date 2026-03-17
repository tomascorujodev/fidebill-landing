import Hero from './components/Hero'
import Card from './components/Card'
import Features from './components/Features'
import Cta from './components/Cta'
import WhatsAppButton from './components/WhatsAppButton'
import Stats from './components/Stats'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
    <Navbar></Navbar>
      <Hero></Hero>
      <Features></Features>
      <Stats></Stats>
      <Cta></Cta>
      <WhatsAppButton></WhatsAppButton>
      <Card></Card>
      <Footer></Footer>
    </>
  )
}

export default App
