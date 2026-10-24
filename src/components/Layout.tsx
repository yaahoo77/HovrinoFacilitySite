import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useLang, type L } from "@/lib/i18n";
import { SITE, UI } from "@/data/site";
import { useArchive } from "@/lib/archive";

const NAV = [
  { to: "/", k: "home" as const },
  { to: "/about", k: "about" },
  { to: "/departments", k: "departments" },
  { to: "/specialists", k: "specialists" },
  { to: "/patients", k: "patients" },
  { to: "/contacts", k: "contacts" },
] as const satisfies readonly { to: string; k: keyof typeof UI }[];

export const ANNOUNCEMENTS: { date: string; text: L }[] = [
  { date: "10.03.2005", text: { ru: "С 21 марта изменён порядок передачи посылок пациентам отделения №2.", en: "From 21 March the procedure for delivering parcels to Department 2 patients will change." } },
  { date: "01.03.2005", text: { ru: "Объявлен набор на вакантные должности медицинских сестёр.", en: "Vacancies for nurses are now open." } },
  { date: "15.02.2005", text: { ru: "Проведён день открытых дверей реабилитационного отделения.", en: "The Rehabilitation Department held an open day." } },
];

export function Emblem() {
  return (
    <svg className="emblem" viewBox="0 0 64 64" aria-label="Emblem">
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <rect x="30.5" y="12" width="3" height="40" fill="currentColor" />
      <path d="M32 16c8 2 8 7 0 9s-8 7 0 9 8 7 0 9" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="35" cy="15" r="2" fill="currentColor" />
    </svg>
  );
}

export function Layout({ crumb, children, side = true, contentClassName = "" }: { crumb?: L; children: ReactNode; side?: boolean; contentClassName?: string }) {
  const { lang, setLang, t } = useLang();
  const { unlocked } = useArchive();
  return (
    <div className="site">
      <div className="masthead">
        <Emblem />
        <div className="masthead-title">
          <div className="small">{t(SITE.dept)}</div>
          <div className="big">{t(SITE.short)}</div>
          <div className="small">{t(SITE.full)}</div>
        </div>
        <div className="flags">
          <button className="flag" aria-pressed={lang === "ru"} onClick={() => setLang("ru")} title="Русский">🇷🇺</button>
          <button className="flag" aria-pressed={lang === "en"} onClick={() => setLang("en")} title="English">🇬🇧</button>
        </div>
      </div>
      <nav className="nav">
        {NAV.map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} activeProps={{ className: "active" }}>
            {t(UI[n.k])}
          </Link>
        ))}
        {unlocked && (
          <Link to="/cameras" activeProps={{ className: "active" }}>{t({ ru: "Камеры", en: "Cameras" })}</Link>
        )}
      </nav>
      <div className="crumbs">
        {t(UI.youAreHere)}: <Link to="/">{t(UI.home)}</Link>
        {crumb && <> » {t(crumb)}</>}
      </div>
      <div className="cols">
        {side && (
          <aside className="sidebar">
            <div className="box">
              <div className="box-h">{t(UI.announcements)}</div>
              <div className="box-b">
                {ANNOUNCEMENTS.map((a) => (
                  <p key={a.date} style={{ textAlign: "left" }}>
                    <b>{a.date}</b>
                    <br />
                    {t(a.text)}
                  </p>
                ))}
              </div>
            </div>
            <div className="box">
              <div className="box-h">{t(UI.hours)}</div>
              <div className="box-b" style={{ whiteSpace: "pre-line" }}>{t(UI.hoursText)}</div>
            </div>
            <div className="box">
              <div className="box-b meta">
                {t(UI.visitors)}: <b>004817</b>
              </div>
            </div>
          </aside>
        )}
        <main className={`main ${contentClassName}`}>{children}</main>
      </div>
      <div className="footer">
        © 1998–2005 {t(SITE.short)}. {t(UI.rights)}
        <br />
        {t(SITE.address)}
        <br />
        {t(UI.updated)}: {SITE.updated} · {t(UI.best)}
      </div>
    </div>
  );
}
