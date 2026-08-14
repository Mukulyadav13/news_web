import Link from "next/link";
import type { NewsArticle } from "@/lib/types";

export function BreakingStrip({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="border-b border-brand-dark bg-brand text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6">
        <span className="flex shrink-0 items-center gap-2 rounded bg-black/30 px-2.5 py-1 text-[11px] font-black uppercase tracking-widest text-white">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-90" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          BBC LIVE
        </span>
        <div className="no-scrollbar flex items-center gap-6 overflow-x-auto whitespace-nowrap">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/news/${a.slug}`}
              className="shrink-0 text-xs font-semibold tracking-wide text-white/95 transition-opacity hover:text-white hover:underline"
            >
              {a.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
