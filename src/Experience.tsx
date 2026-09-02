import Section from './Section'
import { step } from './motion'
import { useLang } from './i18n'

export default function Experience({ active }: { active: boolean }) {
  const { t } = useLang()

  return (
    <Section label={t.nav.experience} active={active}>
      <h2
        className="mt-10 max-w-[20ch] text-[10vw] leading-[0.95] tracking-tight sm:mt-14 sm:max-w-[14ch] sm:text-[5.5vw]"
        style={step(active, 420, '32px')}
      >
        {t.experience.heading}
      </h2>

      <ol className="mt-10 sm:mt-16">
        {t.experience.roles.map((item, i) => (
          <li
            key={item.year}
            className="border-t border-cream/20 py-6 sm:py-7"
            style={step(active, 560 + i * 90)}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-10">
              <span className="text-xs uppercase tracking-[0.2em] text-cream/60 sm:w-36 sm:shrink-0">
                {item.year}
              </span>

              <div className="sm:flex sm:flex-1 sm:items-baseline sm:gap-10">
                <h3 className="text-xl leading-tight sm:w-64 sm:shrink-0 sm:text-2xl">
                  {item.role}
                  <span className="mt-1 block text-sm text-cream/60 sm:text-base">
                    {item.place}
                  </span>
                </h3>

                <p className="mt-3 max-w-prose text-sm leading-relaxed text-cream/80 sm:mt-0 sm:text-base">
                  {item.note}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
