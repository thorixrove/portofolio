import { useEffect, useRef, useState } from "react";

const SIDE = 48; // ukuran ikon di sidebar (px)
const DOCK = 44; // ukuran ikon saat di footer (px)
const GAP_SIDE = 12;
const GAP_DOCK = 12;
const MARGIN_RIGHT = 30;
export const FOOTER_SLOT_ID = "footer-socials";

const socials = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/thoriq-wajo-960579322",
    bg: "bg-[#2563eb]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/USERNAME_KAMU", // TODO: ganti username
    bg: "bg-gradient-to-tr from-[#a855f7] via-[#ec4899] to-[#fb923c]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
    {
    name: "GitHub",
    href: "https://github.com/thorixrove",
    bg: "bg-[#24292f]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    name: "CV",
    href: "/socialmedia/cv.pdf", // taruh file CV di folder public/cv.pdf
    bg: "bg-[#0b0f19] border border-white/10",
    download: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
      </svg>
    ),
  },
];

/**
 * Taruh komponen ini di Footer, di tempat ikon-ikon akan "mendarat".
 * Dia hanya kotak kosong penanda posisi tujuan.
 */
export const FooterSocialsSlot = () => (
  <div
    id={FOOTER_SLOT_ID}
    aria-hidden="true"
    style={{
      width: socials.length * DOCK + (socials.length - 1) * GAP_DOCK,
      height: DOCK,
    }}
  />
);

type Pos = { x: number; y: number };

const SocialSidebar = () => {
  const [positions, setPositions] = useState<Pos[]>([]);
  const [docked, setDocked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const dockedRef = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const slot = document.getElementById(FOOTER_SLOT_ID);
      const rect = slot?.getBoundingClientRect();

      // dianggap "sampai bawah" kalau slot footer sudah terlihat penuh di layar
      const shouldDock = !!rect && rect.bottom <= vh;

      if (shouldDock !== dockedRef.current) {
        dockedRef.current = shouldDock;
        setDocked(shouldDock);
        setAnimating(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setAnimating(false), 1200);
      }

      const total = socials.length * SIDE + (socials.length - 1) * GAP_SIDE;
      setPositions(
        socials.map((_, i) =>
          shouldDock && rect
            ? { x: rect.left + i * (DOCK + GAP_DOCK), y: rect.top }
            : {
                x: vw - MARGIN_RIGHT - SIDE,
                y: vh / 2 - total / 2 + i * (SIDE + GAP_SIDE),
              }
        )
      );
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.clearTimeout(timer.current);
    };
  }, []);

  if (positions.length === 0) return null;

  const size = docked ? DOCK : SIDE;

  return (
    <>
      {socials.map((s, i) => (
        <a
          key={s.name}
          href={s.href}
          target={s.href.startsWith("mailto") ? undefined : "_blank"}
          rel="noopener noreferrer"
          download={s.download ? "CV-Thoriq.pdf" : undefined}
          aria-label={s.name}
          className={`group fixed left-0 top-0 z-50 flex items-center justify-center rounded-full text-white shadow-lg hover:brightness-110 ${s.bg}`}
          style={{
            width: size,
            height: size,
            transform: `translate3d(${positions[i].x}px, ${positions[i].y}px, 0)`,
            // animasi hanya saat berpindah; saat mengikuti scroll dimatikan agar tidak delay
            transition: animating
              ? `transform 900ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 90}ms, width 500ms ease ${i * 90}ms, height 500ms ease ${i * 90}ms`
              : "none",
          }}
        >
          <span className="transition-transform duration-200 group-hover:scale-110">
            {s.icon}
          </span>
          <span
            className={`pointer-events-none absolute whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100 ${
              docked ? "bottom-full left-1/2 mb-2 -translate-x-1/2" : "right-full mr-3"
            }`}
          >
            {s.name}
          </span>
        </a>
      ))}
    </>
  );
};

export default SocialSidebar;