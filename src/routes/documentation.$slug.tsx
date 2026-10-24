import { createFileRoute, notFound } from "@tanstack/react-router";
import { DocView } from "@/components/DocView";
import { DOCS } from "@/data/documents";

export const Route = createFileRoute("/documentation/$slug")({
  loader: ({ params }) => {
    const doc = DOCS.find((d) => d.slug === params.slug);
    if (!doc) throw notFound();
    return { slug: doc.slug, title: doc.title.ru };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Архив ККПБ №3` },
          { name: "description", content: `Архивный документ: ${loaderData.title}` },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: "Архив исторических документов ККПБ №3" },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary" },
          { name: "robots", content: "noindex" },
        ]
      : [{ title: "Документ не найден" }, { name: "robots", content: "noindex" }],
  }),
  component: DocRoute,
});

function DocRoute() {
  const { slug } = Route.useLoaderData();
  return <DocView slug={slug} goto />;
}
