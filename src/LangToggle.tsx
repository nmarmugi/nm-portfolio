import { LANGS, useLang } from './i18n'

/**
 * EN / IT switch. Positioning and entrance come from the caller; `color`
 * lets a view outside the cream palette paint it in its own ink.
 */
export default function LangToggle({
  className = '',
  style,
  color,
}: {
  className?: string
  style?: React.CSSProperties
  color?: string
}) {
  const { lang, setLang, t } = useLang()

  return (
    <div
      className={`flex items-center gap-2 font-hn text-sm ${
        color ? '' : 'text-cream'
      } ${className}`}
      style={{ ...style, ...(color ? { color } : null) }}
      aria-label={t.aria.language}
    >
      {LANGS.map((code, i) => (
        <span key={code} className="flex items-center gap-2">
          {i > 0 && <span className="opacity-30">/</span>}
          <button
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            className={`uppercase transition-opacity duration-300 hover:opacity-60 ${
              lang === code ? 'opacity-100' : 'opacity-40'
            }`}
          >
            {code}
          </button>
        </span>
      ))}
    </div>
  )
}
