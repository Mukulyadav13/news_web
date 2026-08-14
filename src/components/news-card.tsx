import Link from "next/link";
import { EyeIcon, MessageIcon } from "@/components/icons";
import { SmartImage } from "@/components/image";
import type { NewsArticleWithCategory } from "@/lib/types";
import { cn, formatNumber, timeAgo } from "@/lib/utils";

const SCOPE_LABEL: Record<string, string> = {
  national: "National",
  international: "World",
};

function Meta({ article, className }: { article: NewsArticleWithCategory; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-xs text-ink-faint", className)}>
      <span className="font-semibold text-brand">{timeAgo(article.publishedAt)}</span>
      <span>•</span>
      <span className="inline-flex items-center gap-1">
        <EyeIcon className="h-3.5 w-3.5" />
        {formatNumber(article.views)}
      </span>
      <span className="inline-flex items-center gap-1">
        <MessageIcon className="h-3.5 w-3.5" />
        {formatNumber(article.commentsCount)}
      </span>
    </div>
  );
}

function CategoryTag({ article }: { article: NewsArticleWithCategory }) {
  const label = article.category?.name || SCOPE_LABEL[article.scope] || "World";
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="inline-block border-l-2 border-brand pl-2 text-[11px] font-extrabold uppercase tracking-wider text-brand">
        {label}
      </span>
      {article.isBreaking ? (
        <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
          LIVE
        </span>
      ) : null}
    </div>
  );
}

export function NewsCard({
  article,
  variant = "card",
  className,
}: {
  article: NewsArticleWithCategory;
  variant?: "card" | "hero" | "row" | "compact" | "wide";
  className?: string;
}) {
  if (variant === "wide") {
    return (
      <Link
        href={`/news/${article.slug}`}
        className={cn(
          "group flex gap-4 rounded-2xl bg-surface p-4 border border-line transition-all duration-200 hover:border-brand/40 hover:shadow-md sm:gap-5",
          className,
        )}
      >
        <SmartImage
          src={article.imageUrl}
          alt={article.title}
          className="aspect-[4/3] w-32 shrink-0 rounded-xl sm:w-60"
          imgClassName="transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <CategoryTag article={article} />
          <h3 className="mt-1 line-clamp-2 text-lg font-extrabold leading-snug tracking-tight text-ink transition-colors duration-200 group-hover:text-brand sm:text-xl">
            {article.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft sm:line-clamp-3">
            {article.summary}
          </p>
          <Meta article={article} className="mt-auto pt-3" />
        </div>
      </Link>
    );
  }

  if (variant === "hero") {
    return (
      <Link
        href={`/news/${article.slug}`}
        className={cn(
          "group block overflow-hidden rounded-2xl border border-line bg-surface shadow-xs transition-all duration-200 hover:border-brand/40 hover:shadow-md",
          className,
        )}
      >
        <SmartImage
          src={article.imageUrl}
          alt={article.title}
          eager
          className="aspect-[16/8.5] w-full"
          imgClassName="transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="p-5 sm:p-6">
          <CategoryTag article={article} />
          <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight text-ink transition-colors duration-200 group-hover:text-brand sm:text-3xl">
            {article.title}
          </h2>
          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-ink-soft sm:text-base">
            {article.summary}
          </p>
          <Meta article={article} className="mt-4" />
        </div>
      </Link>
    );
  }

  if (variant === "row") {
    return (
      <Link
        href={`/news/${article.slug}`}
        className={cn(
          "group flex gap-4 rounded-xl p-3 transition-colors duration-200 hover:bg-muted",
          className,
        )}
      >
        <SmartImage
          src={article.imageUrl}
          alt={article.title}
          className="h-20 w-28 shrink-0 rounded-lg sm:h-24 sm:w-36"
        />
        <div className="min-w-0">
          <CategoryTag article={article} />
          <h3 className="mt-1 line-clamp-2 text-base font-extrabold leading-snug tracking-tight text-ink transition-colors duration-200 group-hover:text-brand">
            {article.title}
          </h3>
          <Meta article={article} className="mt-2" />
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/news/${article.slug}`}
        className={cn("group block", className)}
      >
        <CategoryTag article={article} />
        <h3 className="line-clamp-3 text-base font-bold leading-snug tracking-tight text-ink transition-colors duration-200 group-hover:text-brand">
          {article.title}
        </h3>
        <span className="mt-2 block text-xs font-semibold text-brand">{timeAgo(article.publishedAt)}</span>
      </Link>
    );
  }

  return (
    <Link
      href={`/news/${article.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md",
        className,
      )}
    >
      <SmartImage
        src={article.imageUrl}
        alt={article.title}
        className="aspect-[16/9] w-full"
        imgClassName="transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <div className="flex flex-1 flex-col p-4">
        <CategoryTag article={article} />
        <h3 className="mt-1.5 line-clamp-2 text-lg font-extrabold leading-snug tracking-tight text-ink transition-colors duration-200 group-hover:text-brand">
          {article.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {article.summary}
        </p>
        <Meta article={article} className="mt-auto pt-3" />
      </div>
    </Link>
  );
}
