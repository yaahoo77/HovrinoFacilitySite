import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LangProvider } from "@/lib/i18n";
import { PatientWatch } from "@/components/PatientWatch";

function NotFoundComponent() {
  return (
    <div className="site" style={{ padding: 20 }}>
      <h1>404 — Страница не найдена / Page not found</h1>
      <p>Запрашиваемый документ отсутствует на сервере. / The requested document is not on this server.</p>
      <Link to="/">На главную / Home</Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="site" style={{ padding: 20 }}>
      <h1>Ошибка сервера / Server error</h1>
      <button
        className="btn"
        onClick={() => {
          router.invalidate();
          reset();
        }}
      >
        Повторить / Retry
      </button>{" "}
      <a href="/">На главную / Home</a>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ККПБ №3 «Северная Заря»" },
      { name: "description", content: "Краевая клиническая психиатрическая больница №3 «Северная Заря», г. Верхнеозёрск." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <PatientWatch />
        <Outlet />
      </LangProvider>
    </QueryClientProvider>
  );
}
