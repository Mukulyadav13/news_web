import Link from "next/link";
import type { NewsArticleWithCategory } from "@/lib/types";
import { formatNumber, timeAgo } from "@/lib/utils";

export function BbcRankings({ articles }: { articles: NewsArticleWithCategory[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
        <h3 className="text-base font-extrabold uppercase tracking-tight text-ink">
          Most Read
        </h3>
        <span className="text-xs font-bold uppercase tracking-wider text-brand">
          BBC Live
        </span>
      </div>

      <ol className="space-y-4">
        {articles.slice(0, 5).map((article, index) => (
          <li key={article.id} className="group border-b border-line/60 pb-3 last:border-b-0 last:pb-0">
            <Link href={`/news/${article.slug}`} className="flex items-start gap-4">
              <span className="text-3xl font-black leading-none text-brand/80 transition-colors group-hover:text-brand">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-bold leading-snug text-ink transition-colors group-hover:text-brand">
                  {article.title}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-faint">
                  <span>{timeAgo(article.publishedAt)}</span>
                  <span>•</span>
                  <span>{formatNumber(article.views)} views</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
