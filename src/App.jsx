import About from "./sections/About"
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
      </main>
      <Footer/>
    </>
  )
}

export default App