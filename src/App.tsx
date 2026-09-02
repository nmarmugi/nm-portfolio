import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import About from "./About";
import Experience from "./Experience";
import Contact from "./Contact";
import Secret from "./Secret";
import ViewLayer from "./ViewLayer";
import LangToggle from "./LangToggle";
import { useLang, EMAIL, GITHUB_URL, LINKEDIN_URL, SITE_URL } from "./i18n";
import { VIEW_EASE } from "./motion";
import { useScrollBoost } from "./useScrollBoost";

/**
 * Assets, served from /public
 *   portrait.png     → cutout portrait, black and white
 *   portrait-alt.png → same frame in colour, surfaced by the scroll boost
 */
const PORTRAIT = { webp: "/portrait.webp", png: "/portrait.png" };
const PORTRAIT_COLOUR = {
  webp: "/portrait-alt.webp",
  png: "/portrait-alt.png",
};
/** Intrinsic size of both files: lets the browser reserve the box up front. */
const PORTRAIT_W = 433;
const PORTRAIT_H = 577;

type View = "home" | "about" | "experience" | "contact" | "secret";

const NAV_VIEWS: View[] = ["about", "experience", "contact"];

/** Absolute hrefs open in a new tab; in-page ones stay put. */
const isExternal = (href: string) => href.startsWith("http");

const MARQUEE_TEXT = "Nicola Marmugi&nbsp;";

/**
 * Four copies, two per half of the track. The loop shifts by half its width,
 * so one half has to be wider than the viewport or a gap opens at the seam
 * on wide screens.
 */
const MARQUEE_COPIES = [0, 1, 2, 3];

const DRAWER_EASE = VIEW_EASE;

export default function App() {
  const { t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState<View>("home");

  const drawer = useRef<HTMLElement>(null);
  const burger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /** Escape closes the drawer, and focus goes where the eye already is. */
  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        burger.current?.focus();
      }
    };

    const firstLink = drawer.current?.querySelector("a");
    firstLink?.focus();

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const go = (next: View) => {
    setMenuOpen(false);
    setView(next);
  };

  const isHome = view === "home";
  // The secret page brings its own palette and its own way out, so the
  // cream chrome steps aside rather than fighting a light background.
  const isSecret = view === "secret";
  const boost = useScrollBoost(isHome && !menuOpen);
  const navLinks = NAV_VIEWS.map((v) => ({
    view: v,
    href: `#${v}`,
    label: t.nav[v as keyof typeof t.nav],
  }));
  const socialLinks = [
    { label: "LinkedIn", href: LINKEDIN_URL },
    { label: "GitHub", href: GITHUB_URL },
    { label: t.social.website, href: SITE_URL },
    { label: t.social.email, href: `mailto:${EMAIL}` },
  ];

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden">
      <a
        href="#main"
        className="sr-only z-50 focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:bg-cream focus:px-3 focus:py-2 focus:font-hn focus:text-sm focus:text-[#2b2b2b]"
      >
        {t.aria.skip}
      </a>

      <h1 className="sr-only">Nicola Marmugi, Front End Developer</h1>

      {/* Background: flat editorial grey */}
      <div className="anim-fade-in absolute inset-0 bg-[#2b2b2b]" />
      <div
        ref={boost.glow}
        className="pointer-events-none absolute inset-0 opacity-0"
      />

      {/* ---------- HOME VIEW ---------- */}
      {/* Skip-link target: needs tabindex, or focus never lands here */}
      <div id="main" tabIndex={-1} />
      <ViewLayer active={isHome} exit="up">
        {/* Marquee name */}
        <div
          className="anim-fade-up absolute inset-x-0 top-[16vh] z-10 overflow-hidden sm:top-[14vh]"
          style={{ animationDelay: "500ms" }}
          aria-hidden="true"
        >
          <div ref={boost.marquee} className="w-max will-change-transform">
            <div className="marquee flex w-max whitespace-nowrap pb-[0.25em] font-hn text-[16vh] leading-none text-cream sm:text-[26vh]">
              {MARQUEE_COPIES.map((i) => (
                <span
                  key={i}
                  className="pr-[6vw]"
                  dangerouslySetInnerHTML={{ __html: MARQUEE_TEXT }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cream rule */}
        <div
          className="anim-line absolute inset-x-6 bottom-[5.5rem] z-10 hidden h-0.5 bg-cream sm:inset-x-10 sm:bottom-28 sm:block"
          style={{ animationDelay: "1200ms" }}
        />

        {/* Front portrait: cutout anchored to the base of the viewport */}
        <div
          className="anim-rise-in pointer-events-none absolute inset-0 z-20 flex items-end justify-center"
          style={{ animationDelay: "300ms" }}
        >
          <button
            type="button"
            onClick={() => go("secret")}
            aria-label={t.aria.secret}
            className="pointer-events-auto relative cursor-pointer"
          >
            <picture>
              <source srcSet={PORTRAIT.webp} type="image/webp" />
              <img
                src={PORTRAIT.png}
                alt={t.aria.portrait}
                width={PORTRAIT_W}
                height={PORTRAIT_H}
                decoding="async"
                fetchPriority="high"
                className="h-[60vh] w-auto object-contain object-bottom sm:h-[72vh]"
              />
            </picture>
            <picture>
              <source srcSet={PORTRAIT_COLOUR.webp} type="image/webp" />
              <img
                ref={boost.portraitAlt}
                src={PORTRAIT_COLOUR.png}
                alt=""
                aria-hidden="true"
                width={PORTRAIT_W}
                height={PORTRAIT_H}
                decoding="async"
                fetchPriority="low"
                className="absolute inset-0 h-full w-full object-contain object-bottom opacity-0 [filter:drop-shadow(0_10px_18px_rgba(0,0,0,0.45))_drop-shadow(0_28px_60px_rgba(0,0,0,0.35))]"
              />
            </picture>
          </button>
        </div>

        {/* Footer legibility veil: mobile only, sits between portrait and footer */}
        <div
          className="anim-fade-in pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-44 bg-gradient-to-t from-black via-black/75 to-transparent sm:hidden"
          style={{ animationDelay: "1300ms" }}
        />

        {/* Footer */}
        <footer className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between px-6 pb-5 font-hn text-xs font-bold leading-relaxed text-cream sm:px-10 sm:pb-8 sm:text-sm sm:font-normal">
          <div className="anim-fade-up" style={{ animationDelay: "1400ms" }}>
            {t.footer.left.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </footer>
      </ViewLayer>

      {/* ---------- SECTION VIEWS ---------- */}
      <ViewLayer active={view === "about"}>
        <About active={view === "about"} />
      </ViewLayer>

      <ViewLayer active={view === "experience"}>
        <Experience active={view === "experience"} />
      </ViewLayer>

      <ViewLayer active={view === "contact"}>
        <Contact active={view === "contact"} />
      </ViewLayer>

      {/* Unlisted: reached only by clicking the portrait */}
      <ViewLayer active={view === "secret"}>
        <Secret active={view === "secret"} onBack={() => go("home")} />
      </ViewLayer>

      {/* Header scrim: content slides under the chrome instead of colliding
          with it while a section scrolls */}
      <div
        style={{
          opacity: isSecret ? 0 : 1,
          transition: `opacity 400ms ${VIEW_EASE}`,
        }}
      >
        <div
          className="anim-fade-in pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-gradient-to-b from-[#2b2b2b] via-[#2b2b2b]/85 to-transparent sm:h-36"
          style={{ animationDelay: "700ms" }}
        />
      </div>

      {/* ---------- CHROME (persists across views) ---------- */}
      <header
        className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8"
        style={{
          opacity: isSecret ? 0 : 1,
          visibility: isSecret ? "hidden" : "visible",
          transition: `opacity 400ms ${VIEW_EASE}, visibility 0s linear ${
            isSecret ? "400ms" : "0ms"
          }`,
        }}
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            go("home");
          }}
          className="anim-fade-up font-hn text-lg tracking-wide text-cream transition-opacity duration-300 hover:opacity-60"
          style={{ animationDelay: "800ms" }}
        >
          Nicola
        </a>

        <div className="hidden items-start gap-16 sm:flex lg:gap-24">
          <div className="flex flex-col gap-0.5">
            <span
              className="anim-fade-up font-hn text-sm text-cream"
              style={{ animationDelay: "900ms" }}
            >
              2026
            </span>
            <LangToggle
              className="anim-fade-up"
              style={{ animationDelay: "950ms" }}
            />
          </div>

          <nav className="flex flex-col gap-0.5 font-hn text-sm text-cream">
            {navLinks.map((link, i) => (
              <a
                key={link.view}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.view);
                }}
                aria-current={link.view === view ? "page" : undefined}
                className={`anim-fade-up transition-opacity duration-300 hover:opacity-60 ${
                  link.view === view ? "opacity-60" : ""
                }`}
                style={{ animationDelay: `${1000 + i * 80}ms` }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <nav className="flex flex-col gap-0.5 font-hn text-sm text-cream">
            {socialLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                target={isExternal(link.href) ? "_blank" : undefined}
                rel={isExternal(link.href) ? "noopener noreferrer" : undefined}
                className="anim-fade-up transition-opacity duration-300 hover:opacity-60"
                style={{ animationDelay: `${1150 + i * 80}ms` }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hamburger / close, above the drawer, so one control does both */}
      <div
        style={{
          opacity: isSecret ? 0 : 1,
          visibility: isSecret ? "hidden" : "visible",
          transition: `opacity 400ms ${VIEW_EASE}, visibility 0s linear ${
            isSecret ? "400ms" : "0ms"
          }`,
        }}
      >
        <button
          ref={burger}
          type="button"
          aria-label={menuOpen ? t.aria.close : t.aria.open}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="anim-fade-up absolute right-6 top-6 z-50 flex h-10 w-10 items-center justify-center text-cream sm:hidden"
          style={{ animationDelay: "900ms" }}
        >
          {/* Bars, folding away as the panel opens */}
          <span
            className="absolute flex h-4 w-6 flex-col justify-between"
            style={{
              opacity: menuOpen ? 0 : 1,
              transition: `opacity 300ms ${DRAWER_EASE}`,
            }}
          >
            <span
              className="block h-px w-full bg-cream transition-transform duration-500"
              style={{
                transitionTimingFunction: DRAWER_EASE,
                transform: menuOpen
                  ? "translateY(7.5px) rotate(45deg)"
                  : "none",
              }}
            />
            <span
              className="block h-px w-full bg-cream transition-opacity duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block h-px w-full bg-cream transition-transform duration-500"
              style={{
                transitionTimingFunction: DRAWER_EASE,
                transform: menuOpen
                  ? "translateY(-7.5px) rotate(-45deg)"
                  : "none",
              }}
            />
          </span>

          {/* Close icon, arriving once the panel has travelled */}
          <span
            className="absolute"
            style={{
              transform: menuOpen ? "rotate(0deg)" : "rotate(90deg)",
              opacity: menuOpen ? 1 : 0,
              transition: `transform 500ms ${DRAWER_EASE}, opacity 500ms ${DRAWER_EASE}`,
              transitionDelay: menuOpen ? "300ms" : "0ms",
            }}
          >
            <X size={26} strokeWidth={1.5} />
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div className="sm:hidden">
        <div
          onClick={() => setMenuOpen(false)}
          className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
            menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />

        <aside
          ref={drawer}
          aria-label={t.drawer.index}
          aria-hidden={!menuOpen}
          className="fixed inset-y-0 right-0 z-40 w-[80%] max-w-sm bg-[#141414] px-8 py-10"
          style={{
            transform: menuOpen ? "translateX(0)" : "translateX(100%)",
            // Same reason as the view layers: off-screen is still focusable.
            visibility: menuOpen ? "visible" : "hidden",
            transition: `transform 600ms ${DRAWER_EASE}, visibility 0s linear ${
              menuOpen ? "0ms" : "600ms"
            }`,
          }}
        >
          <p
            className="font-hn text-xs uppercase tracking-[0.2em] text-cream/60"
            style={{
              transform: menuOpen ? "translateY(0)" : "translateY(16px)",
              opacity: menuOpen ? 1 : 0,
              transition: `transform 500ms ${DRAWER_EASE}, opacity 500ms ${DRAWER_EASE}`,
              transitionDelay: menuOpen ? "250ms" : "0ms",
            }}
          >
            {t.drawer.index}
          </p>

          <nav className="mt-6 flex flex-col gap-5">
            {navLinks.map((link, i) => (
              <a
                key={link.view}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.view);
                }}
                aria-current={link.view === view ? "page" : undefined}
                className="font-hn text-4xl leading-none text-cream"
                style={{
                  transform: menuOpen ? "translateY(0)" : "translateY(24px)",
                  opacity: menuOpen ? 1 : 0,
                  transition: `transform 600ms ${DRAWER_EASE}, opacity 600ms ${DRAWER_EASE}`,
                  transitionDelay: menuOpen ? `${300 + i * 80}ms` : "0ms",
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p
            className="mt-12 font-hn text-xs uppercase tracking-[0.2em] text-cream/60"
            style={{
              transform: menuOpen ? "translateY(0)" : "translateY(16px)",
              opacity: menuOpen ? 1 : 0,
              transition: `transform 500ms ${DRAWER_EASE}, opacity 500ms ${DRAWER_EASE}`,
              transitionDelay: menuOpen ? "500ms" : "0ms",
            }}
          >
            {t.drawer.find}
          </p>

          <nav className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {socialLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                target={isExternal(link.href) ? "_blank" : undefined}
                rel={isExternal(link.href) ? "noopener noreferrer" : undefined}
                onClick={() => setMenuOpen(false)}
                className="font-hn text-sm text-cream"
                style={{
                  transform: menuOpen ? "translateY(0)" : "translateY(16px)",
                  opacity: menuOpen ? 1 : 0,
                  transition: `transform 500ms ${DRAWER_EASE}, opacity 500ms ${DRAWER_EASE}`,
                  transitionDelay: menuOpen ? `${550 + i * 60}ms` : "0ms",
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p
            className="mt-12 font-hn text-xs uppercase tracking-[0.2em] text-cream/60"
            style={{
              transform: menuOpen ? "translateY(0)" : "translateY(16px)",
              opacity: menuOpen ? 1 : 0,
              transition: `transform 500ms ${DRAWER_EASE}, opacity 500ms ${DRAWER_EASE}`,
              transitionDelay: menuOpen ? "700ms" : "0ms",
            }}
          >
            {t.drawer.language}
          </p>

          <LangToggle
            className="mt-4"
            style={{
              transform: menuOpen ? "translateY(0)" : "translateY(16px)",
              opacity: menuOpen ? 1 : 0,
              transition: `transform 500ms ${DRAWER_EASE}, opacity 500ms ${DRAWER_EASE}`,
              transitionDelay: menuOpen ? "750ms" : "0ms",
            }}
          />
        </aside>
      </div>
    </section>
  );
}
