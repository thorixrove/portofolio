import { lazy, Suspense, useState } from 'react';
import { certifications } from '../constants/index.js';
import Button from '../components/Button.jsx';
import TechStackFlow from '../components/TechStackFlow.jsx';
import AvatarSwitcher from '../components/AvatarSwitcher.jsx';
import Keyboard from '../components/Keyboard.jsx';
import LazyMount from '../components/LazyMount.jsx';

const Globe = lazy(() => import('react-globe.gl'));

const About = () => {
    const [hasCopied, setHasCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText('thorixrover@gmail.com')
        setHasCopied(true)

        setTimeout(() => {
            setHasCopied(false)
        }, 2000)
    }

    const handleContactClick = () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <section className="c-space my-20" id="about">
            <div className="grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-5 h-full">
                <div className="col-span-1 xl:row-span-3">
                    <div className="grid-container">
                        <div className="w-full sm:h-[276px] h-[220px]">
                            <AvatarSwitcher />
                        </div>

                        <div>
                            <p className="grid-headtext">Hi, I'am Thoriq Wajo</p>
                            <p className="grid-subtext">
                                With 3 years of experience, I have honed my skills in both frontend and backend dev, creating dynamic
                                and responsive websites.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 xl:row-span-3">
                    <div className="grid-container">
                        <div className="w-full sm:h-[276px] h-[220px]">
                            <TechStackFlow />
                        </div>

                        <div>
                            <p className="grid-headtext">Tech Stack</p>
                            <p className="grid-subtext">
                                I specialize in a variety of languages, frameworks, and tools that allow me to build robust and scalable
                                applications
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 xl:row-span-4">
                    <div className="grid-container">
                        <div className="rounded-3xl w-full sm:h-[326px] h-fit flex justify-center items-center">
                            <LazyMount>
                                <Suspense fallback={null}>
                                    <Globe
                                        height={326}
                                        width={326}
                                        backgroundColor="rgba(0, 0, 0, 0)"
                                        backgroundImageOpacity={0.5}
                                        showAtmosphere
                                        showGraticules
                                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                                        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                                        labelsData={[{ lat: -0.86, lng: 134.06, text: 'Manokwari, Indonesia', color: 'white', size: 500 }]}
                                    />
                                </Suspense>
                            </LazyMount>
                        </div>
                        <div>
                            <p className="grid-headtext">I’m very flexible with time zone communications & locations</p>
                            <p className="grid-subtext">I&apos;m based in Manokwari, Indonesia and open to remote work worldwide.</p>
                            <Button name="Contact Me" isBeam containerClass="w-full mt-10" onClick={handleContactClick} />
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-2 xl:row-span-3">
                    <div className="grid-container">
                        <div className="w-full sm:h-[266px] h-[260px]">
                            <Keyboard />
                        </div>

                        <div >
                            <p className="grid-headtext">My Passion for Coding</p>
                            <p className="grid-subtext">
                                I love solving problems and building things through code. Programming isn&apos;t just my
                                profession, it&apos;s my passion. I enjoy exploring new technologies, and enhancing my skills.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-1 xl:row-span-2">
                    <div className="grid-container">
                        <img
                            src="assets/grid4.png"
                            alt="grid-4"
                            className="w-full md:h-[150px] sm:h-[276px] h-fit object-cover sm:object-top"
                        />

                        <div className="space-y-2">
                            <p className="grid-subtext text-center">Contact me</p>
                            <div className="copy-container" onClick={handleCopy}>
                                <img src={hasCopied ? 'assets/tick.svg' : 'assets/copy.svg'} alt="copy" />
                                <p className="lg:text-2xl md:text-xl font-medium text-gray_gradient text-white">thorixrover@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1 xl:col-span-3">
                    <div className="grid-container">
                        <div>
                            <p className="grid-headtext">Certifications &amp; Achievements</p>
                            <p className="grid-subtext">
                                Certificates and achievements that support my expertise.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                            {certifications.map(({ id, title, issuer, date, skills, logo, image }) => (
                                <a
                                    key={id}
                                    href={image}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-5 p-5 rounded-lg bg-[#080b12] border border-transparent hover:border-black-500 transition-colors"
                                >
                                    <img
                                        src={logo}
                                        alt={issuer}
                                        className="w-[76px] h-[76px] shrink-0 rounded-full bg-white p-2 object-contain"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-xl font-semibold text-white font-generalsans leading-snug">{title}</p>
                                        <p className="text-lg text-white-600 font-generalsans">{issuer}</p>
                                        <p className="text-sm text-white-600 mt-1">{date}</p>
                                        <p className="text-xs text-white-500 mt-2">Skills: {skills}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About