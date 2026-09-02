import Section from './Section'
import { step } from './motion'
import { useLang } from './i18n'

export default function About({ active }: { active: boolean }) {
  const { t } = useLang()

  return (
    <Section label={t.nav.about} active={active}>
      <h2
        className="mt-10 max-w-[22ch] text-[10vw] leading-[0.95] tracking-tight sm:mt-14 sm:max-w-[16ch] sm:text-[5.5vw]"
        style={step(active, 420, '32px')}
      >
        {t.about.heading}
      </h2>

      <div className="mt-10 flex flex-col gap-10 sm:mt-16 sm:flex-row sm:gap-24">
        <div className="max-w-prose space-y-4 text-sm leading-relaxed sm:flex-1 sm:text-base">
          {t.about.paragraphs.map((text, i) => (
            <p key={i} style={step(active, 560 + i * 80)}>
              {text}
            </p>
          ))}
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-7 text-sm sm:w-64 sm:shrink-0 sm:grid-cols-1 sm:gap-y-6">
          {t.about.meta.map((item, i) => (
            <div key={item.label} style={step(active, 800 + i * 70, '16px')}>
              <dt className="text-xs uppercase tracking-[0.2em] text-cream/60">
                {item.label}
              </dt>
              <dd className="mt-2">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
