import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useLang } from "@/lib/i18n";
import { meta } from "@/lib/meta";
import { corruptText } from "@/lib/archive";
import { UI } from "@/data/site";
import { STAFF, STATUS, toEnId } from "@/data/staff";

export const Route = createFileRoute("/specialists")({
  head: () => meta("Специалисты", "Справочник сотрудников ККПБ №3: врачи, психологи, медицинские сёстры, администрация."),
  component: Specialists,
});

function Specialists() {
  const { t, lang } = useLang();
  const T = (ru: string, en: string) => t({ ru, en });
  const X = corruptText;
  return (
    <Layout crumb={UI.specialists} side={false}>
      <h1>{T("Справочник сотрудников", "Staff Directory")}</h1>
      <p>{T("Сведения предоставлены отделом кадров. Статус учётной записи обновляется ежеквартально.", "Data provided by the Personnel Department. Record status is updated quarterly.")}</p>
      <p className="err">{T("Ошибка чтения базы данных. Записи повреждены.", "Database read error. Records are damaged.")}</p>
      <div className="meta">{t(UI.found)}: {STAFF.length}</div>
      <table className="tbl">
        <thead><tr>
          <th>{T("Таб. №", "ID")}</th><th>{T("Ф.И.О.", "Name")}</th><th>{T("Должность", "Position")}</th>
          <th>{T("Подразделение", "Department")}</th><th>{T("Дата приёма", "Start date")}</th><th>{T("Статус", "Status")}</th>
        </tr></thead>
        <tbody>
          {STAFF.map((s) => (
            <tr key={s.id}>
              <td style={{ whiteSpace: "nowrap" }}>{X(lang === "ru" ? s.id : toEnId(s.id))}</td>
              <td><b>{X(lang === "ru" ? s.ru : s.en)}</b><br /><span className="meta">{X(lang === "ru" ? s.en : s.ru)}</span></td>
              <td>{X(t(s.title))}</td><td>{X(t(s.dept))}</td><td>{X(s.start)}</td><td>{t(STATUS[s.status])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
