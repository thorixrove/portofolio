import { useState } from 'react';

import { navLinks } from '../constants/index.js';

const NavItems = ({ onClick = () => { } }) => (
    <ul className='nav-ul'>
        {navLinks.map((item) => (
            <li key={item.id} className='nav-li'>
                <a href={item.href} className='nav-li_a' onClick={onClick}>
                    {item.name}
                </a>
            </li>
        ))}
    </ul>
)

const ResumeButton = ({ className = '', onClick = () => { } }) => (
    <a
        href="/socialmedia/cv.pdf"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={`inline-flex items-center justify-center rounded-full bg-[#0ca840] px-6 py-2 text-base font-semibold text-white shadow-lg transition-all hover:brightness-110 active:scale-95 ${className}`}
    >
        Resume
    </a>
)

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)
    const closeMenu = () => setIsOpen(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/90">
            <div className="w-full">
                <div className="flex justify-between items-center py-5 mx-auto c-space">
                    <a href="/" className="text-neutral-400 font-bold text-xl hover:text-white transition-colors">
                        Thoriq Wajo
                    </a>

                    <button
                        onClick={toggleMenu}
                        className="text-neutral-400 hover:text-white focus:outline-none sm:hidden flex"
                        aria-label="Toggle menu"
                    >
                        <img src={isOpen ? 'assets/close.svg' : 'assets/menu.svg'} alt='toggle' className='w-6 h-6' />
                    </button>

                    <nav className="sm:flex hidden items-center gap-6">
                        <NavItems />
                        <ResumeButton />
                    </nav>
                </div>
            </div>

            <div className={`nav-sidebar ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <nav className='p-5'>
                    <NavItems onClick={closeMenu} />
                    <ResumeButton className="mt-4 w-full" onClick={closeMenu} />
                </nav>
            </div>
        </header>
    )
}

export default Navbar
