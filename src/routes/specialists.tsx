import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useLang } from "@/lib/i18n";
import { meta } from "@/lib/meta";
import { UI } from "@/data/site";
import { STAFF, STATUS, toEnId } from "@/data/staff";

const GLYPHS = "?#%&@§¤=+*/<>[]{}~^жЯћ▒░";

function corrupt(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) h = Math.imul(h ^ value.charCodeAt(i), 16777619);
  return value.replace(/\d/g, () => {
    h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0;
    return GLYPHS.charAt(h % GLYPHS.length);
  });
}

export const Route = createFileRoute("/specialists")({
  head: () => meta("Специалисты", "Справочник сотрудников ККПБ №3: врачи, психологи, медицинские сёстры, администрация."),
  component: Specialists,
});

function Specialists() {
  const { t, lang } = useLang();
  const T = (ru: string, en: string) => t({ ru, en });
  const [q, setQ] = useState("");
  const n = q.trim().toLowerCase();
  const list = STAFF.filter((s) =>
    !n || [s.ru, s.en, s.title.ru, s.title.en, s.dept.ru, s.dept.en].some((v) => v.toLowerCase().includes(n)),
  );
  return (
    <Layout crumb={UI.specialists} side={false}>
      <h1>{T("Справочник сотрудников", "Staff Directory")}</h1>
      <p>{T("Сведения предоставлены отделом кадров. Статус учётной записи обновляется ежеквартально.", "Data provided by the Personnel Department. Record status is updated quarterly.")}</p>
      <form onSubmit={(e) => e.preventDefault()} style={{ margin: "6px 0" }}>
        {t(UI.search)}: <input className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder={T("Ф.И.О., должность", "Name, title")} />{" "}
        <button className="btn" type="button" onClick={() => setQ("")}>{t(UI.reset)}</button>
      </form>
      <div className="meta">{t(UI.found)}: {list.length}</div>
      {list.length === 0 ? <p className="err">{t(UI.nothing)}</p> : (
        <table className="tbl">
          <thead><tr>
            <th>{T("Таб. №", "ID")}</th><th>{T("Ф.И.О.", "Name")}</th><th>{T("Должность", "Position")}</th>
            <th>{T("Подразделение", "Department")}</th><th>{T("Дата приёма", "Start date")}</th><th>{T("Статус", "Status")}</th>
          </tr></thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td style={{ whiteSpace: "nowrap" }}>{(lang === "ru" ? "ПБ3-" : "PB3-") + corrupt(toEnId(s.id).slice(4))}</td>
                <td><b>{lang === "ru" ? s.ru : s.en}</b><br /><span className="meta">{lang === "ru" ? s.en : s.ru}</span></td>
                <td>{t(s.title)}</td><td>{t(s.dept)}</td><td>{corrupt(s.start)}</td><td>{t(STATUS[s.status])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
