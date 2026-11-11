import { useEffect, useRef, useState } from 'react';

/**
 * Menunda render children (mis. <Canvas> 3D) sampai wrapper-nya
 * hampir terlihat di layar. Jadi model section bawah (Experience,
 * Projects) tidak ikut rebutan bandwidth dengan model Hero saat
 * halaman pertama kali dibuka.
 */
const LazyMount = ({ children, rootMargin = '400px', className = '', style }) => {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (visible) return
        const el = ref.current
        if (!el) return

        if (!('IntersectionObserver' in window)) {
            setVisible(true)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            { rootMargin }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [visible, rootMargin])

    return (
        <div ref={ref} className={className} style={{ width: '100%', height: '100%', ...style }}>
            {visible ? children : null}
        </div>
    )
}

export default LazyMount