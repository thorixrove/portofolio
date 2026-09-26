import About from "./sections/About"
import Contact from "./sections/Contact"
import Footer from "./sections/Footer"
import Hero from "./sections/Hero"
import Navbar from "./sections/Navbar"
import Projects from "./sections/Projects"

const App = () => {
  return (
    <>
      <Navbar/>
      <main className='max-w-7xl mx-auto'>
        <Hero/>
        <About/>
        <Projects/>
        <Contact/>
      </main>
      <Footer/>
    </>
  )
}

export default App