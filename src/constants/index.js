export const navLinks = [
  {
    id: 1,
    name: 'Home',
    href: '#home',
  },
  {
    id: 2,
    name: 'About',
    href: '#about',
  },
  {
    id: 3,
    name: 'Project',
    href: '#project',
  },
  {
    id: 4,
    name: 'Contact',
    href: '#contact',
  },
];


// GANTI CLIENT DI BAGIAN SINI !!!
export const clientReviews = [
  {
    id: 1,
    name: 'Emily Johnson',
    position: 'Marketing Director at GreenLeaf',
    img: 'assets/review1.png',
    review:
      'Working with Adrian was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.',
  },
  {
    id: 2,
    name: 'Mark Rogers',
    position: 'Founder of TechGear Shop',
    img: 'assets/review2.png',
    review:
      'Adrian’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional! Fantastic work.',
  },
  {
    id: 3,
    name: 'John Dohsas',
    position: 'Project Manager at UrbanTech ',
    img: 'assets/review3.png',
    review:
      'I can’t say enough good things about Adrian. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.',
  },
  {
    id: 4,
    name: 'Ether Smith',
    position: 'CEO of BrightStar Enterprises',
    img: 'assets/review4.png',
    review:
      'Adrian was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend backend dev are top-notch.',
  },
];


// GANTI PROJECT DI BAGIAN SINI !!!
export const myProjects = [
  {
    title: 'ARCHISMART - Digital Correspondence Management System',
    desc: 'ARCHISMART is a full-stack web application for managing internal correspondence. It lets staff send and receive letters, classify them, attach digital archive files (PDF, Word, Excel), preview documents, and download a letter together with its metadata as a ZIP file.',
    subdesc:
      'Built with React, Bootstrap, Node.js, Express and MongoDB Atlas. It features JWT authentication, role-based access for admins and users, activity history, report generation, and login rate limiting. The frontend is deployed on Vercel and the backend on Render.',
    href: 'https://archismart.vercel.app',
    texture: '/textures/project/project1.mp4',
    logo: '/assets/bpkad.png',
    logoStyle: {
      backgroundColor: '#13202F',
      border: '0.2px solid #17293E',
      boxShadow: '0px 0px 60px 0px #2F6DB54D',
    },
    spotlight: '/assets/spotlight2.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'Bootstrap',
        path: '/assets/bootstrap.png',
      },
      {
        id: 3,
        name: 'Node.js',
        path: '/assets/nodejs.png',
      },
      {
        id: 4,
        name: 'MongoDB',
        path: '/assets/mongodb.png',
      },
    ],
  },


  // Tempel objek ini ke dalam array proyek di constants/index.js
  // (di bawah entri proyek terakhir). Sesuaikan path aset dengan file milikmu.
  {
    title: 'JH.Floris - Flower Bouquet E-Commerce Platform',
    desc: 'JH.Floris is a full-stack flower bouquet e-commerce platform where customers can browse the catalog, manage their cart, place orders, and track them, while admins manage products and orders through a dedicated dashboard.',
    subdesc:
      'The frontend is built with React 19 (Vite), Tailwind CSS, DaisyUI, Framer Motion, TanStack Query, and Zustand. The backend runs on Express and TypeScript with Drizzle ORM and PostgreSQL, Clerk authentication, Stream chat and video calls for order support, ImageKit for media uploads, and Sentry for monitoring. Payments use a manual bank transfer flow, and the app is deployed to Render with Docker.',
    href: 'https://jh-floris.onrender.com/',
    //  linkLabel: 'Download APK',
    texture: '/textures/project/project2.mp4',
    logo: '/assets/project-logo2.png',
    logoStyle: {
      backgroundColor: '#2A1320',
      border: '0.2px solid #43203A',
      boxShadow: '0px 0px 60px 0px #D6407A4D',
    },
    spotlight: '/assets/spotlight6.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/framer.png',
      },
    ],
  },

  // Paste this object into the projects array in constants/index.js
  // (below the last project entry). Adjust the asset paths to match your files.
  {
    title: 'Almanance - AI-Powered Personal Finance App',
    desc: 'Almanance is a mobile personal finance app that helps users track income and expenses, set budgets, and understand their spending through charts and an AI assistant. Transactions can be added by typing, scanning a receipt, or simply speaking.',
    subdesc:
      'Built with React Native (Expo) and TypeScript, styled with NativeWind, and powered by Expo Router, TanStack Query, and Zustand. Authentication is handled by Clerk with Supabase as the database, while Groq vision and Whisper speech-to-text models extract transactions from receipt photos and voice notes. It also supports multiple currencies and interactive charts.',
    href: 'https://drive.google.com/file/d/1RMMYefKd0pZpdgc6A6oiWp2t8slVxRKU/view?usp=drive_link',
    linkLabel: 'Download APK',
    texture: '/textures/project/project3.mp4',
    logo: '/assets/project-logo3.png',
    logoStyle: {
      backgroundColor: '#1A120B',
      border: '0.2px solid #4A3B2C',
      boxShadow: '0px 0px 60px 0px rgba(205, 127, 50, 0.3)', // #CD7F32 dengan opasitas 30%
    },
    spotlight: '/assets/spotlight1.png',
    tags: [
      {
        id: 1,
        name: 'React Native',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Supabase',
        path: '/assets/supabase.png',
      },
    ],
  },


  {
    title: 'Vegetable Classification - Species & Quality Detection',
    desc: 'Vegetable Classification is a web application that identifies the species and freshness quality of vegetables from a single photo. Users upload an image and instantly get the species, quality level (young, ripe, wilted, or rotten), confidence scores, and storage tips.',
    subdesc:
      'Built with React.js, Vite, and FastAPI, and powered by two MobileNetV2 models trained with TensorFlow. It recognizes 8 vegetable species and 16 quality classes, with a consumption warning banner and a local prediction history.',
    href: 'https://vegetable-clasification.vercel.app/',
    texture: '/textures/project/project4.mp4',
    logo: '/assets/project-logo4.png',
    logoStyle: {
      backgroundColor: '#14301F',
      border: '0.2px solid #1F7A45',
      boxShadow: '0px 0px 60px 0px #3F9A624D',
    },
    spotlight: '/assets/spotlight3.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'FastAPI',
        path: '/assets/fastapi.png',
      },
      {
        id: 3,
        name: 'TensorFlow',
        path: '/assets/tensorflow.png',
      },
      {
        id: 4,
        name: 'Python',
        path: '/assets/python.png',
      },
    ],
  },
];

export const calculateSizes = (isSmall, isMobile, isTablet) => {
  return {
    deskScale: isSmall ? 0.05 : isMobile ? 0.06 : 0.065,
    deskPosition: isMobile ? [0.5, -4.5, 0] : [0.25, -5.5, 0],

    // posisi Target (model komputer) - rotasi sudah dibuat lurus di Target.jsx,
    // jadi posisi cukup di tengah (x: 0); z didorong agak ke belakang biar pas
    targetPosition: isSmall ? [0, -5, -2] : isMobile ? [1, -4, -2] : isTablet ? [0, -3.5, 0] : [0, -3, 0],
    targetScale: isSmall ? 0.48 : isMobile ? 0.75 : isTablet ? 0.85 : 1,

    // cube digeser tinggi & ke kanan supaya tidak nabrak laci desk
    cubePosition: isSmall ? [4, -3, -2] : isMobile ? [5, -8, 2] : isTablet ? [10, -13, 1] : [13, -4, 0],
    cubeScale: isSmall ? 0.5 : isMobile ? 0.6 : isTablet ? 0.7 : 0.74,

    reactLogoPosition: isSmall ? [3, 5, 0] : isMobile ? [3, 5, 2] : isTablet ? [7, 4, 1] : [11, 5, 0],
    reactLogoScale: isSmall ? 0.22 : isMobile ? 0.40 : isTablet ? 0.45 : 0.45,

    // ring didekatkan (x tidak sejauh versi awal) supaya tetap kelihatan di frustum kamera
    ringPosition: isSmall ? [-3, 6, -1] : isMobile ? [-7, 8, 2] : isTablet ? [-10, 10, 1] : [-16, 8, 0],
    ringScale: isSmall ? 0.35 : isMobile ? 0.4 : isTablet ? 0.45 : 0.45,
  };
};

export const workExperiences = [
  {
    id: 1,
    name: 'BPKAD West Papua',
    pos: 'Web Developer Intern',
    duration: 'Jan 2026 - Feb 2026',
    title: "Built a correspondence and document management website for BPKAD Papua Barat. The system digitizes incoming and outgoing letters so records are easier to organize, track, and retrieve.",
    icon: '/assets/bpkad.png',
    animation: 'victory',
  },
  {
    id: 2,
    name: 'BMKG West Papua',
    pos: 'IT Support',
    duration: 'Jun 2024 - Jul 2024',
    title: "Handled server installation and setup at BMKG Manokwari, supporting the IT infrastructure the office relies on for daily operations.",
    icon: '/assets/bmkg.png',
    animation: 'clapping',
  },
  {
    id: 3,
    name: 'Freelance',
    pos: 'Graphic Designer',
    duration: '2023 - Present',
    title: "Delivered a variety of design projects for clients, from branding and social media visuals to print materials, using Canva and Photoshop to turn ideas into polished, consistent designs.",
    icon: '/assets/design.png',
    animation: 'salute',
  },
];

// GANTI SERTIFIKAT DI BAGIAN SINI !!!
export const certifications = [
  {
    id: 1,
    title: 'Toefl',
    issuer: 'Unipa',
    date: 'March 2025 - March 2027',
    skills: 'Writing, Listening, Reading',
    logo: '/certificates/logos/logo_01.png',
    image: '/certificates/01.png',
  },

];

// Tempel di src/constants/index.js (ganti nama file sesuai gambar di public/assets/)
export const avatars = [
  '/assets/avatar1.webp',
  '/assets/avatar2.webp',
  '/assets/avatar3.webp',
  '/assets/avatar4.webp',
  '/assets/avatar5.webp',
  '/assets/avatar6.webp',
  '/assets/avatar7.webp',
  '/assets/avatar8.webp',
  '/assets/avatar9.webp',
  '/assets/avatar10.webp',
];