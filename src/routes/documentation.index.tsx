import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { ArchiveGate } from "@/components/ArchiveGate";
import { useLang } from "@/lib/i18n";
import { meta } from "@/lib/meta";
import { UI } from "@/data/site";
import { DOCS } from "@/data/documents";
import { useArchive } from "@/lib/archive";

export const Route = createFileRoute("/documentation/")({
  head: () => meta("Документация", "Архив исторических документов ККПБ №3: отчёты, акты проверок, служебная документация."),
  component: DocIndex,
});

function DocIndex() {
  const [ringing, setRinging] = useState(false);
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    fetch("/phonegame/documentation.php", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setRinging(d?.status === "planned"))
      .catch(() => {});
  }, []);
  const { t } = useLang();
  const T = (ru: string, en: string) => t({ ru, en });
  const { unlocked, tryUnlock, lock } = useArchive();
  const [q, setQ] = useState("");
  const n = q.trim().toLowerCase();
  const visible = DOCS.filter((d) => unlocked || d.public);
  const list = visible.filter((d) => !n || [d.no, d.date, d.title.ru, d.title.en, d.author.ru, d.author.en, d.category.ru, d.category.en, ...d.body.map((b) => ("v" in b ? b.v.ru + " " + b.v.en : ""))].join(" ").toLowerCase().includes(n));
  return (
    <Layout crumb={UI.documentation} contentClassName="documentation">
      <h1>{T("Документация", "Documentation")}</h1>
      {ringing && <p className="meta">☎ Your phone will ring soon.</p>}
      <p>{T("Раздел содержит отчёты учреждения и материалы архива исторических документов.", "This section contains institutional reports and materials from the historical records archive.")}</p>
      {!unlocked && <ArchiveGate onTry={tryUnlock} />}
      {unlocked && <p className="meta">{T("Доступ к архиву открыт на время сеанса.", "Archive access granted for this session.")} <a href="#" onClick={(e) => { e.preventDefault(); lock(); }}>{T("Выйти", "Log out")}</a></p>}
      <div style={{ margin: "6px 0" }}>
        {t(UI.search)}: <input className="field" value={q} onChange={(e) => setQ(e.target.value)} />{" "}
        <button className="btn" type="button" onClick={() => setQ("")}>{t(UI.reset)}</button>
      </div>
      <div className="meta">{t(UI.found)}: {list.length}</div>
      {list.length === 0 ? <p className="err">{t(UI.nothing)}</p> : (
        <table className="tbl">
          <thead><tr><th>№</th><th>{T("Дата", "Date")}</th><th>{T("Наименование", "Title")}</th><th>{T("Категория", "Category")}</th></tr></thead>
          <tbody>
            {list.map((d) => (
              <tr key={d.slug}>
                <td style={{ whiteSpace: "nowrap" }}>{d.no}</td><td>{d.date}</td>
                <td><Link to="/documentation/$slug" params={{ slug: d.slug }}>{t(d.title)}</Link></td>
                <td>{t(d.category)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
