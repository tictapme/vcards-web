export type HomeHeroContent = {
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  priceHtml: string;
  socialProof: string;
  platformTitle: string;
};

const SITE_ORIGIN = 'https://www.tictapcards.com';

export const homeHeroContentByLang: Record<'es' | 'en' | 'de', HomeHeroContent> = {
  es: {
    title: 'Tarjetas de visita que generan leads',
    description:
      'Comparte tu perfil profesional, capta leads automaticamente con IA y gestiona contactos desde una plataforma inteligente. Ahorra en impresion y tiempo sin perder contactos.',
    ctaHref: `${SITE_ORIGIN}/contacto/`,
    ctaLabel: 'Solicita una demo para tu equipo',
    priceHtml: '11,99€/ano<br>por empleado.',
    socialProof: 'Unete a mas de 60.000 profesionales que ya digitalizaron su networking',
    platformTitle: 'Mas que una tarjeta: tu plataforma de networking inteligente',
  },
  en: {
    title: 'Business cards that generate leads',
    description:
      'Share your professional profile, automatically capture leads with AI, and manage contacts from a smart platform. Save on printing and time without losing contacts.',
    ctaHref: `${SITE_ORIGIN}/en/contact/`,
    ctaLabel: 'Request a demo for your team',
    priceHtml: 'EUR11.99/year<br>per employee.',
    socialProof: 'Join over 60,000 professionals who have already digitalized their networking.',
    platformTitle: 'More than a card: your smart networking platform',
  },
  de: {
    title: 'Visitenkarten, die Leads generieren',
    description:
      'Teilen Sie Ihr berufliches Profil, erfassen Sie Leads automatisch mit KI und verwalten Sie Kontakte uber eine intelligente Plattform. Sparen Sie Druckkosten und Zeit, ohne Kontakte zu verlieren.',
    ctaHref: `${SITE_ORIGIN}/de/kontakt/`,
    ctaLabel: 'Fordern Sie eine Demo fur Ihr Team an',
    priceHtml: '11,99 EUR/Jahr<br>pro Mitarbeiter.',
    socialProof: 'Schliessen Sie sich mehr als 60.000 Fachleuten an, die ihr Networking bereits digitalisiert haben',
    platformTitle: 'Mehr als nur eine Karte: Ihre smarte Vernetzungsplattform',
  },
};

export const homeClientLogos = [
  {
    src: `${SITE_ORIGIN}/wp-content/uploads/2025/07/Panasonic-copia.png`,
    srcset:
      `${SITE_ORIGIN}/wp-content/uploads/2025/07/Panasonic-copia.png 800w, ${SITE_ORIGIN}/wp-content/uploads/2025/07/Panasonic-copia-300x56.png 300w, ${SITE_ORIGIN}/wp-content/uploads/2025/07/Panasonic-copia-768x142.png 768w`,
    sizes: '(max-width: 800px) 100vw, 800px',
    width: 800,
    height: 148,
  },
  {
    src: `${SITE_ORIGIN}/wp-content/uploads/2025/07/Esade-copia-1024x353.png`,
    srcset:
      `${SITE_ORIGIN}/wp-content/uploads/2025/07/Esade-copia-1024x353.png 1024w, ${SITE_ORIGIN}/wp-content/uploads/2025/07/Esade-copia-300x103.png 300w, ${SITE_ORIGIN}/wp-content/uploads/2025/07/Esade-copia-768x265.png 768w, ${SITE_ORIGIN}/wp-content/uploads/2025/07/Esade-copia.png 1437w`,
    sizes: '(max-width: 1024px) 100vw, 1024px',
    width: 1024,
    height: 353,
  },
  {
    src: `${SITE_ORIGIN}/wp-content/uploads/2025/07/Don-piso-logo-copia.png`,
    srcset:
      `${SITE_ORIGIN}/wp-content/uploads/2025/07/Don-piso-logo-copia.png 718w, ${SITE_ORIGIN}/wp-content/uploads/2025/07/Don-piso-logo-copia-300x76.png 300w`,
    sizes: '(max-width: 718px) 100vw, 718px',
    width: 718,
    height: 181,
  },
  {
    src: `${SITE_ORIGIN}/wp-content/uploads/2025/07/Leti-copia-1024x468.png`,
    srcset:
      `${SITE_ORIGIN}/wp-content/uploads/2025/07/Leti-copia-1024x468.png 1024w, ${SITE_ORIGIN}/wp-content/uploads/2025/07/Leti-copia-300x137.png 300w, ${SITE_ORIGIN}/wp-content/uploads/2025/07/Leti-copia-768x351.png 768w, ${SITE_ORIGIN}/wp-content/uploads/2025/07/Leti-copia-1536x702.png 1536w, ${SITE_ORIGIN}/wp-content/uploads/2025/07/Leti-copia-2048x936.png 2048w`,
    sizes: '(max-width: 1024px) 100vw, 1024px',
    width: 1024,
    height: 468,
  },
];

export const homeHeroImage = {
  src: `${SITE_ORIGIN}/wp-content/uploads/2025/07/135%C2%B0-0%C2%B0-25%C2%B0-1.png`,
  srcset:
    `${SITE_ORIGIN}/wp-content/uploads/2025/07/135°-0°-25°-1.png 536w, ${SITE_ORIGIN}/wp-content/uploads/2025/07/135°-0°-25°-1-213x300.png 213w`,
  sizes: '(max-width: 536px) 100vw, 536px',
  width: 536,
  height: 755,
};
