import React from 'react'
import { FooterSocialsSlot } from '../components/SocialSidebar'

const Footer = () => {
  return (
    <footer className="c-space pt-7 pb-3 border-t border-black-300 flex justify-between items-center flex-wrap gap-5">
      <div className="text-white-500 flex gap-2">
        <p>Terms & Conditions</p>
        <p>|</p>
        <p>Privacy Policy</p>
      </div>

      {/* Tempat ikon sosial media "mendarat" saat scroll sampai bawah */}
      <FooterSocialsSlot />

      <p className="text-white-500">© {new Date().getFullYear()} Thoriq Wajo. All rights reserved.</p>
    </footer>
  )
}

export default Footer