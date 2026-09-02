import Section from './Section'
import { step } from './motion'
import { useLang, EMAIL } from './i18n'

export default function Contact({ active }: { active: boolean }) {
  const { t } = useLang()

  return (
    <Section label={t.nav.contact} active={active}>
      <h2
        className="mt-10 max-w-[18ch] text-[10vw] leading-[0.95] tracking-tight sm:mt-14 sm:max-w-[14ch] sm:text-[5.5vw]"
        style={step(active, 420, '32px')}
      >
        {t.contact.heading}
      </h2>

      <a
        href={`mailto:${EMAIL}`}
        className="mt-10 block w-fit max-w-full break-all text-xl leading-tight tracking-tight underline decoration-cream/30 underline-offset-8 transition-opacity duration-300 hover:opacity-60 sm:mt-14 sm:text-4xl sm:decoration-2"
        style={step(active, 560, '28px')}
      >
        {EMAIL}
      </a>

      <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-7 text-sm sm:mt-16 sm:grid-cols-4 sm:gap-x-10">
        {t.contact.channels.map((item, i) => {
          const href = 'href' in item ? item.href : undefined

          return (
            <div key={item.label} style={step(active, 700 + i * 70, '16px')}>
              <dt className="text-xs uppercase tracking-[0.2em] text-cream/60">
                {item.label}
              </dt>
              <dd className="mt-2">
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      href.startsWith('http') ? 'noopener noreferrer' : undefined
                    }
                    className="transition-opacity duration-300 hover:opacity-60"
                  >
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          )
        })}
      </dl>
    </Section>
  )
}
