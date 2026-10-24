import { useEffect, useState } from "react";
import { Link, notFound, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ArchiveGate } from "@/components/ArchiveGate";
import { useLang } from "@/lib/i18n";
import { UI } from "@/data/site";
import { DOCS } from "@/data/documents";
import { useArchive, downloadText, corruptText } from "@/lib/archive";

/**
 * Shared document viewer.
 * `goto` — after a successful unlock, navigate to /documentation/$slug_/unlocked
 * (the URL reflects the unlocked state). On the /unlocked route itself, `goto`
 * is false and unlock state is kept in sessionStorage per document.
 */
export function DocView({ slug, goto }: { slug: string; goto: boolean }) {
  const navigate = useNavigate();
  const { t } = useLang();
  const T = (ru: string, en: string) => t({ ru, en });
  const { unlocked, tryUnlock } = useArchive();
  const docKey = `kkpb3_doc_${slug}`;
  const [docUnlocked, setDocUnlocked] = useState(false);
  useEffect(() => {
    try { setDocUnlocked(sessionStorage.getItem(docKey) === "1"); } catch { /* ignore */ }
  }, [docKey]);
  const doc = DOCS.find((d) => d.slug === slug);
  if (!doc) throw notFound();
  const gotoUnlocked = () => {
    if (goto) navigate({ to: "/documentation/$slug/unlocked", params: { slug } });
  };
  const renderText = (text: string) => doc.corrupted === false ? text : corruptText(text);
  const back = <Link to="/documentation">{t(UI.back)}</Link>;
  if (!doc.public && !unlocked)
    return <Layout crumb={UI.documentation} contentClassName="documentation">{back}<ArchiveGate onTry={(pw) => {
      const ok = tryUnlock(pw);
      // Only switch to /unlocked once the document itself is open (it may still ask for its own code).
      if (ok && (!doc.password || docUnlocked)) gotoUnlocked();
      return ok;
    }} /></Layout>;
  if (doc.password && !docUnlocked)
    return <Layout crumb={UI.documentation} contentClassName="documentation">{back}<ArchiveGate key={doc.slug} title={doc.title} documentOnly onTry={(password) => {
      if (password.trim().toLowerCase() !== doc.password?.toLowerCase()) return false;
      try { sessionStorage.setItem(docKey, "1"); } catch { /* ignore */ }
      setDocUnlocked(true);
      gotoUnlocked();
      return true;
    }} /></Layout>;
  return (
    <Layout crumb={UI.documentation} side={false} contentClassName="documentation">
      {back}
      <table className="tbl" style={{ marginTop: 8 }}><tbody>
        <tr><th>{T("Номер документа", "Document No.")}</th><td>{doc.no}</td><th>{T("Дата", "Date")}</th><td>{doc.date}{doc.revised && <> ({T("ред.", "rev.")} {doc.revised})</>}</td></tr>
        <tr><th>{T("Автор / подразделение", "Author / unit")}</th><td>{t(doc.author)}</td><th>{T("Категория", "Category")}</th><td>{t(doc.category)}</td></tr>
        <tr><th>{T("Гриф", "Distribution")}</th><td colSpan={3}>{t(doc.access)}</td></tr>
      </tbody></table>
      <div className="paper">
        <div style={{ textAlign: "right" }}><span className="stamp">{t(doc.access)}</span></div>
        <h3>{t(doc.title)}</h3>
        {doc.recording && <section aria-label={t(doc.recording.label)}>
          <h3>{t(doc.recording.label)}</h3>
          <audio className="w-full" controls preload="metadata" src={doc.recording.url} aria-label={t(doc.recording.label)} />
        </section>}
        {doc.corrupted !== false && <p className="meta">{T("Файл повреждён. Восстановление невозможно.", "File corrupted. Recovery not possible.")}</p>}
        {doc.body.map((b, i) => {
          if (b.t === "table") return (
            <table key={i} className="tbl"><thead><tr>{b.head.map((h, j) => <th key={j}>{renderText(t(h))}</th>)}</tr></thead>
              <tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}>{renderText(t(c))}</td>)}</tr>)}</tbody></table>
          );
          if (b.t === "h") return <h3 key={i}>{renderText(t(b.v))}</h3>;
          if (b.t === "sig") return <p key={i} className="sig">{renderText(t(b.v))}</p>;
          if (b.t === "note") return <p key={i} className="meta">{renderText(t(b.v))}</p>;
          return <p key={i}>{renderText(t(b.v))}</p>;
        })}
      </div>
      {doc.attachments && (
        <>
          <h2>{T("Приложения", "Attachments")}</h2>
          <ul>
            {doc.attachments.map((a) => (
              <li key={a.name}>
                {a.content ? (
                   <>{a.name} [<a href="#" onClick={(e) => { e.preventDefault(); if (a.content) downloadText(a.name, renderText(t(a.content))); }}>{t(UI.download)}</a>]</>
                 ) : (
                   <><span className="missing">{a.name}</span> — <span className="meta">{t(UI.fileMissing)}</span></>
                 )}
              </li>
            ))}
          </ul>
        </>
      )}
    </Layout>
  );
}
