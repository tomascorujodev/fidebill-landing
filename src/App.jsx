import { useState } from 'react'
import Hero from './components/Hero'
import Carousel from './components/Carousel'
import Card from './components/Card'
import Features from './components/Features'
import Cta from './components/Cta'
import WhatsAppButton from './components/WhatsAppButton'
import Stats from './components/Stats'
import Footer from './components/Footer'
import Pricing from './components/Pricing'
import Navbar from './components/Navbar'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar></Navbar>
      <Hero></Hero>
      <Features></Features>
      <Pricing></Pricing>
      <Stats></Stats>
      <Cta></Cta>
      {/* <Carousel></Carousel> */}
      <WhatsAppButton></WhatsAppButton>
      <Card></Card>
      <Footer></Footer>
    </>
  )
}

export default App
