// Flag sederhana yang dibagi antar komponen 3D, supaya HeroCamera tahu
// kapan harus "diam dulu" (tidak ikut memutar model) karena user sedang
// men-drag elemen lain (Rings/ReactLogo/Cube), bukan model utamanya.
export const interactionState = {
    draggingElement: false,
}