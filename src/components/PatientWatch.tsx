import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

const KEY = "kkpb3_card_seen";

export function PatientWatch() {
  const navigate = useNavigate();
  useEffect(() => {
    let stopped = false;
    const check = () => {
      if (stopped || document.hidden) return;
      fetch("/phonegame/patient.php", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => {
          if (!j || !j.card) return;
          const stamp = String(j.card);
          let seen: string | null = null;
          try { seen = localStorage.getItem(KEY); } catch { seen = null; }
          if (seen === stamp) return;
          try { localStorage.setItem(KEY, stamp); } catch { }
          navigate({ to: "/patient-card" });
        })
        .catch(() => {});
    };
    check();
    const id = setInterval(check, 2000);
    return () => { stopped = true; clearInterval(id); };
  }, [navigate]);
  return null;
}
