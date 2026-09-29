import About from "./sections/About"
import Contact from "./sections/Contact"
import Footer from "./sections/Footer"
import Hero from "./sections/Hero"
import Navbar from "./sections/Navbar"
import Projects from "./sections/Projects"
import WorkExperience from "./sections/Experience"
import Clients from "./sections/Clients"
import SocialSidebar from "./components/SocialSidebar"

const App = () => {
  return (
    <>
      <Navbar/>
      <main className='max-w-7xl mx-auto'>
        <Hero/>
        <About/>
        <WorkExperience/>  
        <Projects/>
        <Clients/>
        <Contact/>
        <SocialSidebar/>
      </main>
      <Footer/>
    </>
  )
}

export default App