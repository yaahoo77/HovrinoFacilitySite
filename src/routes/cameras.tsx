import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useLang } from "@/lib/i18n";
import { meta } from "@/lib/meta";
import { useArchive } from "@/lib/archive";

import ward14Audio from "@/assets/ward14.wav.asset.json";

export const Route = createFileRoute("/cameras")({
  head: () => ({
    ...meta("Видеонаблюдение", "Служебная страница видеонаблюдения."),
    meta: [...meta("Видеонаблюдение", "Служебная страница видеонаблюдения.").meta, { name: "robots", content: "noindex" }],
  }),
  component: Cameras,
});

const CAMS = [
  { id: "01", ru: "Главный вход", en: "Main entrance", state: "ok" },
  { id: "02", ru: "Приёмное отделение", en: "Admissions", state: "ok" },
  { id: "03", ru: "Корпус Б, коридор 1", en: "Building B, corridor 1", state: "ok" },
  { id: "04", ru: "Корпус Б, пост №2", en: "Building B, station No. 2", state: "none" },
  { id: "05", ru: "Палата №14", en: "Ward 14", state: "frozen", audio: ward14Audio.url },
  { id: "06", ru: "Архив, подвал", en: "Archive, basement", state: "none" },
] as const;

const STATIC_VIDEO = "/media/no-signal.mp4";
const STATIC_WEBM = "/media/no-signal.webm";

function Clock({ frozen }: { frozen?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    if (frozen) return;
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, [frozen]);
  if (frozen) return <>14.11.2003 03:10:00</>;
  if (!now) return null;
  const p = (n: number) => String(n).padStart(2, "0");
  return <>{`${p(now.getDate())}.${p(now.getMonth() + 1)}.2005 ${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`}</>;
}

function Cameras() {
  const { t } = useLang();
  const T = (ru: string, en: string) => t({ ru, en });
  const { unlocked } = useArchive();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [sound, setSound] = useState<string | null>(null);

  const downloadRecording = async (id: string, url: string, filename: string) => {
    if (downloading) return;
    setDownloading(id);
    setDownloadError(null);
    let objectUrl: string | undefined;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Recording unavailable");
      objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setDownloadError(id);
    } finally {
      if (objectUrl) {
        const urlToRevoke = objectUrl;
        window.setTimeout(() => URL.revokeObjectURL(urlToRevoke), 1000);
      }
      setDownloading(null);
    }
  };

  if (!unlocked) {
    return (
      <Layout crumb={{ ru: "Ошибка", en: "Error" }}>
        <h1>404</h1>
        <p>{T("Страница не найдена.", "Page not found.")} <Link to="/">{T("На главную", "Home")}</Link></p>
      </Layout>
    );
  }

  return (
    <Layout crumb={{ ru: "Видеонаблюдение", en: "Video surveillance" }} side={false}>
      <h1>{T("Система видеонаблюдения", "Video surveillance system")}</h1>
      {(
        <>
          <p className="meta">{T("Режим: запись. Хранение — 72 часа.", "Mode: recording. Retention — 72 hours.")}</p>
          <div className="cams">
            {CAMS.map((c) => (
              <div key={c.id} className="cam">
                <div className={`cam-view ${c.state}`} onClick={c.state === "none" ? () => setSound(sound === c.id ? null : c.id) : undefined}>
                  {c.state === "none" && (
                    <video className="cam-static" autoPlay loop playsInline muted={sound !== c.id} preload="auto">
                      <source src={STATIC_WEBM} type="video/webm" />
                      <source src={STATIC_VIDEO} type="video/mp4" />
                    </video>
                  )}
                  {c.state === "none" && <span>{T("НЕТ ИЗОБРАЖЕНИЯ", "NO VIDEO")}</span>}
                  <div className="cam-osd">CAM {c.id} · <Clock frozen={c.state === "frozen"} /></div>
                </div>
                <div className="cam-cap">{T(c.ru, c.en)}</div>
                {"audio" in c && c.audio && (
                  <div style={{ marginTop: 4 }}>
                    <div className="meta">{T("Видеосигнал отсутствует. Только звук.", "No video signal. Sound only.")}</div>
                    <audio controls preload="none" src={c.audio} style={{ width: "100%" }} />
                  </div>
                )}
                {c.state === "none" && (
                  <div className="meta" style={{ marginTop: 4 }}>
                    <a href="#" onClick={(e) => { e.preventDefault(); setSound(sound === c.id ? null : c.id); }}>
                      {sound === c.id ? T("Звук: вкл.", "Sound: on") : T("Звук: выкл.", "Sound: off")}
                    </a>
                  </div>
                )}
                <div className="meta mt-1">
                  {(() => {
                    const file = "audio" in c && c.audio ? { url: c.audio, name: "CAM-05-ward14.wav" } : c.state === "none" ? { url: STATIC_VIDEO, name: `CAM-${c.id}-no-signal.mp4` } : null;
                    if (!file) return <span>{T("Скачать запись: недоступно", "Download recording: unavailable")}</span>;
                    return <>
                      <a href={file.url} download={file.name} aria-disabled={downloading === c.id} onClick={(e) => { e.preventDefault(); void downloadRecording(c.id, file.url, file.name); }}>
                        {downloading === c.id ? T("Загрузка…", "Downloading…") : T("Скачать запись", "Download recording")}
                      </a>
                      {downloadError === c.id && <p className="err" role="alert">{T("Не удалось скачать запись. Повторите попытку.", "Download failed. Please try again.")}</p>}
                    </>;
                  })()}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}
