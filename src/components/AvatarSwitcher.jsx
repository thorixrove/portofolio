import { useEffect, useState } from 'react';
import { avatars } from '../constants/index.js';

const AvatarSwitcher = () => {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        avatars.forEach((src) => {
            const img = new Image()
            img.src = src
        })
    }, [])

    const next = () => setIndex((i) => ( i + 1) % avatars.length)

    return (
        <div className="avatar-stage"> 
            <div className="avatar-window">
                <div className="avatar-dots">
                    <span><span/></span>
                </div>
                <div className="avatar-tiles">
                    {Array.from({ length: 12}).map((_, i) => (
                        <div key={i} className='avatar-title'/>
                    ))}
                </div>
            </div>

            <button type="button" onClick={next} className="avatar-card" aria-label="Ganti gambar">
                <img key={index} src={avatars[index]} alt="Thoriq avatar" className="avatar-img"/>
            </button>
        </div>
    )
}

export default AvatarSwitcher
