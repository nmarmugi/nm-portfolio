import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { ReactNode } from 'react'

export type Lang = 'en' | 'it'

export const LANGS: Lang[] = ['en', 'it']

const STORAGE_KEY = 'nm-lang'

export const GITHUB_URL = 'https://github.com/nmarmugi'
export const LINKEDIN_URL =
  'https://www.linkedin.com/in/nicola-marmugi-2860b022a'
export const INSTAGRAM_URL = 'https://www.instagram.com/nicolamarmugi/'
export const FACEBOOK_URL = 'https://www.facebook.com/nicola.marmugi.9'

export const SITE_URL = 'https://www.nicolamarmugi.com'
export const SITE_LABEL = 'nicolamarmugi.com'

export const EMAIL = 'nicolamarmugi1@gmail.com'

export const PHONE = '392 8710699'
export const PHONE_HREF = 'tel:+393928710699'

export const COPY = {
  en: {
    nav: { about: 'About', experience: 'Experience', contact: 'Contact' },
    drawer: { index: 'Site Index', find: 'Find Me', language: 'Language' },
    social: { website: 'Landing Pages', email: 'Email' },
    aria: {
      open: 'Open menu',
      close: 'Close menu',
      portrait: 'Portrait',
      language: 'Switch language',
      skip: 'Skip to content',
      secret: 'Open the secret page',
    },
    secret: {
      marquee: 'Music Cooking Comics&nbsp;',
      label: 'Hobbies',
      back: 'Back to business',
      hint: 'What I get up to off the clock.',
      props: {
        'pass-music': {
          title: 'Music',
          text: 'There is always something playing. It sets the tempo of a work session the way it sets the tempo of a service: put on the wrong record and everything drags.',
        },
        'pass-comics': {
          title: 'Comics',
          text: 'Origin stories, mostly. Someone with an ordinary job gets thrown into something bigger and has to learn a new craft from scratch. I may be biased about why that one lands.',
        },
        'pass-food': {
          title: 'Cooking',
          text: 'Ten years in professional kitchens, the last ones as sous chef at the Principe di Piemonte. Mise en place, timing, holding a line when everything arrives at once. I still cook like a service.',
        },
      },
    },
    meta: {
      description:
        'Nicola Marmugi, front end developer in Viareggio, Italy. Product interfaces in React, Next.js and TypeScript.',
    },
    footer: {
      left: [
        'Front End Developer',
        'React · Next.js · TypeScript',
        'Based in Viareggio, Italy',
      ],
    },
    about: {
      heading: 'I build interfaces.',
      paragraphs: [
        'I build interfaces with React, Next.js and TypeScript: component systems meant to be reused rather than rewritten, and the unglamorous states nobody designs until they break.',
        'Most of my work is product front end: dashboards, dynamic forms, authentication, server-side rendering. I came up through two years of freelance consulting, the Edgemony full-time course, and a tech start-up.',
        'I care about the parts people actually feel: motion that carries weight, type that holds the page, states that never leave you guessing.',
      ],
      meta: [
        { label: 'Currently', value: 'Front End Developer, Key2' },
        { label: 'Stack', value: 'React · Next.js · TypeScript' },
        { label: 'Focus', value: 'Product front end' },
        { label: 'Based', value: 'Viareggio, Italy' },
      ],
    },
    experience: {
      heading: 'Where I’ve worked.',
      roles: [
        {
          year: 'Dec 2025 - now',
          role: 'Front End Developer',
          place: 'Key2',
          note: 'Consulting on digital products for clients across sectors. Modern applications in React, Next.js and TypeScript: reusable component systems, UX work, support on backend integration. Agile team, weight on maintainability, performance and continuous delivery.',
        },
        {
          year: 'Oct 2024 - Nov 2025',
          role: 'Front End Developer',
          place: 'AiGot, Pisa',
          note: 'Front end of a restaurant-marketing dashboard in Next.js, React and TypeScript. GrapesJS for the visual editor, Chakra UI for a modular interface, template saving over a REST API. Start-up pace, heavy on problem solving.',
        },
        {
          year: 'Apr 2022 - Mar 2024',
          role: 'Front End Developer, Freelance',
          place: 'Outsourced, various clients',
          note: 'React and Next.js: dashboards, dynamic forms, JWT authentication, server-side rendering. Cross-functional teams, turning requirements into scalable solutions against fixed deadlines and specs.',
        },
        {
          year: '2022',
          role: 'Open source contributor',
          place: 'Myntenance',
          note: 'Ran issues end to end and shipped key features on a collaborative project: performance work, REST API integration, Redux state, accessibility fixes.',
        },
      ],
    },
    contact: {
      heading: 'Got something to build?',
      channels: [
        { label: 'Phone', value: PHONE, href: PHONE_HREF },
        { label: 'LinkedIn', value: 'nicola-marmugi', href: LINKEDIN_URL },
        { label: 'GitHub', value: 'nmarmugi', href: GITHUB_URL },
        { label: 'Instagram', value: '@nicolamarmugi', href: INSTAGRAM_URL },
        { label: 'Facebook', value: 'nicola.marmugi', href: FACEBOOK_URL },
        { label: 'Landing Pages', value: SITE_LABEL, href: SITE_URL },
        { label: 'Based', value: 'Viareggio, LU' },
      ],
    },
  },

  it: {
    nav: { about: 'Chi sono', experience: 'Esperienza', contact: 'Contatti' },
    drawer: { index: 'Indice', find: 'Dove trovarmi', language: 'Lingua' },
    social: { website: 'Landing Page', email: 'Email' },
    aria: {
      open: 'Apri il menu',
      close: 'Chiudi il menu',
      portrait: 'Ritratto',
      language: 'Cambia lingua',
      skip: 'Vai al contenuto',
      secret: 'Apri la pagina segreta',
    },
    secret: {
      marquee: 'Musica Cucina Fumetti&nbsp;',
      label: 'Hobby',
      back: 'Torniamo seri',
      hint: 'Quello che faccio fuori orario.',
      props: {
        'pass-music': {
          title: 'Musica',
          text: 'C’è sempre qualcosa che suona. Detta il tempo di una sessione di lavoro come detta il tempo di un servizio: metti il disco sbagliato e tutto si trascina.',
        },
        'pass-comics': {
          title: 'Fumetti',
          text: 'Soprattutto le origin story. Uno con un lavoro normale finisce dentro qualcosa di più grande e deve imparare da zero un mestiere nuovo. Forse non sono imparziale sul perché quella parte mi prenda.',
        },
        'pass-food': {
          title: 'Cucina',
          text: 'Dieci anni in cucina professionale, gli ultimi da sous chef al Principe di Piemonte. Mise en place, tempi, tenere la linea quando arriva tutto insieme. Cucino ancora come fosse un servizio.',
        },
      },
    },
    meta: {
      description:
        'Nicola Marmugi, front end developer a Viareggio. Interfacce di prodotto in React, Next.js e TypeScript.',
    },
    footer: {
      left: [
        'Front End Developer',
        'React · Next.js · TypeScript',
        'Da Viareggio, Italia',
      ],
    },
    about: {
      heading: 'Costruisco interfacce.',
      paragraphs: [
        'Costruisco interfacce con React, Next.js e TypeScript: sistemi di componenti pensati per essere riusati invece che riscritti, e tutti gli stati poco glamour che nessuno progetta finché non si rompono.',
        'Lavoro soprattutto sul front end di prodotto: dashboard, form dinamici, autenticazione, rendering lato server. Ci sono arrivato con due anni di consulenza freelance, il corso full time di Edgemony e una start-up tech.',
        'Mi interessano le parti che si sentono davvero: movimento che ha peso, tipografia che tiene la pagina, stati che non ti lasciano mai nel dubbio.',
      ],
      meta: [
        { label: 'Oggi', value: 'Front End Developer, Key2' },
        { label: 'Stack', value: 'React · Next.js · TypeScript' },
        { label: 'Focus', value: 'Front end di prodotto' },
        { label: 'Base', value: 'Viareggio, Italia' },
      ],
    },
    experience: {
      heading: 'Dove ho lavorato.',
      roles: [
        {
          year: 'dic 2025 - oggi',
          role: 'Front End Developer',
          place: 'Key2',
          note: 'Consulenza su progetti digitali per clienti di settori diversi. Applicazioni moderne in React, Next.js e TypeScript: componenti riutilizzabili, cura dell’esperienza utente, supporto all’integrazione con i servizi backend. Team Agile, con il peso su manutenibilità, performance e delivery continua.',
        },
        {
          year: 'ott 2024 - nov 2025',
          role: 'Front End Developer',
          place: 'AiGot, Pisa',
          note: 'Front end di una dashboard per il marketing ristorativo in Next.js, React e TypeScript. GrapesJS per l’editor visuale, Chakra UI per un’interfaccia modulare, salvataggio dei template via API REST. Ritmo da startup, molto problem solving.',
        },
        {
          year: 'apr 2022 - mar 2024',
          role: 'Front End Developer, Freelance',
          place: 'Outsourcing, clienti vari',
          note: 'React e Next.js: dashboard, form dinamici, autenticazione JWT, rendering SSR. Team cross-funzionali, requisiti tradotti in soluzioni scalabili rispettando tempi e specifiche tecniche.',
        },
        {
          year: '2022',
          role: 'Contributo open source',
          place: 'Myntenance',
          note: 'Gestione autonoma delle issue e sviluppo di feature chiave in un progetto collaborativo: ottimizzazione delle performance, integrazione API REST, gestione dello stato con Redux, accessibilità.',
        },
      ],
    },
    contact: {
      heading: 'Hai qualcosa da costruire?',
      channels: [
        { label: 'Telefono', value: PHONE, href: PHONE_HREF },
        { label: 'LinkedIn', value: 'nicola-marmugi', href: LINKEDIN_URL },
        { label: 'GitHub', value: 'nmarmugi', href: GITHUB_URL },
        { label: 'Instagram', value: '@nicolamarmugi', href: INSTAGRAM_URL },
        { label: 'Facebook', value: 'nicola.marmugi', href: FACEBOOK_URL },
        { label: 'Landing Page', value: SITE_LABEL, href: SITE_URL },
        { label: 'Base', value: 'Viareggio, LU' },
      ],
    },
  },
} as const

export type Copy = (typeof COPY)['en']

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'it') return saved
  } catch {
    /* private mode: fall through to the browser preference */
  }
  return navigator.language?.toLowerCase().startsWith('it') ? 'it' : 'en'
}

const LangContext = createContext<{
  lang: Lang
  setLang: (next: Lang) => void
  t: Copy
}>({ lang: 'en', setLang: () => {}, t: COPY.en })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', COPY[lang].meta.description)
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* nothing to persist to, so the choice still holds for this visit */
    }
  }, [])

  return (
    <LangContext.Provider
      value={{ lang, setLang, t: COPY[lang] as unknown as Copy }}
    >
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
