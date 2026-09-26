import About from "./sections/About"
import Contact from "./sections/Contact"
import Footer from "./sections/Footer"
import Hero from "./sections/Hero"
import Navbar from "./sections/Navbar"

const App = () => {
  return (
    <>
      <Navbar/>
      <main className='max-w-7xl mx-auto'>
        <Hero/>
        <About/>
        <Contact/>
      </main>
      <Footer/>
    </>
  )
}

export default App