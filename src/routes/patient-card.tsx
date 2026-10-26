import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { useLang } from "@/lib/i18n";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/patient-card")({
  head: () => meta("Карта пациента", "Медицинская карта стационарного больного."),
  component: PatientCard,
});

function PatientCard() {
  const { t } = useLang();
  const T = (ru: string, en: string) => t({ ru, en });
  const [voice, setVoice] = useState<boolean | null>(null);
  const [today, setToday] = useState("");
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const d = new Date();
    setToday(`${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    fetch("/phonegame/patient.php", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setVoice(!!j.voice))
      .catch(() => setVoice(false));
  }, []);

  useEffect(() => {
    if (voice) audio.current?.play().catch(() => {});
  }, [voice]);

  return (
    <Layout side={false} contentClassName="documentation">
      <table className="tbl" style={{ marginTop: 8 }}><tbody>
        <tr><th>{T("Номер карты", "Record No.")}</th><td>6001</td><th>{T("Дата поступления", "Admitted")}</th><td>{today}</td></tr>
        <tr><th>{T("Отделение", "Ward")}</th><td>{T("Палата №14", "Ward 14")}</td><th>{T("Программа", "Programme")}</th><td>X07</td></tr>
        <tr><th>{T("Гриф", "Distribution")}</th><td colSpan={3}>{T("Строго конфиденциально", "Strictly confidential")}</td></tr>
      </tbody></table>
      <div className="paper">
        <div style={{ textAlign: "right" }}><span className="stamp">{T("ПРИНЯТ", "ADMITTED")}</span></div>
        <h3>{T("Медицинская карта стационарного больного", "Inpatient Medical Record")}</h3>
        <table className="tbl"><tbody>
          <tr><th>{T("Ф. И. О.", "Full name")}</th><td>{T("[данные удалены]", "[data removed]")}</td></tr>
          <tr><th>{T("Диагноз", "Diagnosis")}</th><td>{T("[данные удалены]", "[data removed]")}</td></tr>
          <tr><th>{T("Способ поступления", "Admitted via")}</th><td>{T("Телефонный звонок, внутр. 7000", "Telephone call, ext. 7000")}</td></tr>
          <tr><th>{T("Лечащий врач", "Attending physician")}</th><td>{T("Не назначен", "Not assigned")}</td></tr>
        </tbody></table>
        <h3>{T("Запись при поступлении", "Admission recording")}</h3>
        {voice ? (
          <audio ref={audio} className="w-full" controls preload="auto" src="/phonegame/patient.php?voice=1" aria-label={T("Запись при поступлении", "Admission recording")} />
        ) : voice === false ? (
          <p className="meta">{T("Запись отсутствует.", "No recording on file.")}</p>
        ) : null}
        <p className="meta">{T("Голос пациента записан при первом контакте.", "Patient's voice recorded at first contact.")}</p>
      </div>
    </Layout>
  );
}
