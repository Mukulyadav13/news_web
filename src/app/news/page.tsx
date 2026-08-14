import type { Metadata } from "next";
import { NewspaperIcon } from "@/components/icons";
import { NewsCard } from "@/components/news-card";
import { SelectFilterWrapper } from "@/components/filters";
import { EmptyState } from "@/components/ui";
import { getNewsByScope, getNewsCategories } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function NewsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const scope = sp.scope === "international" ? "international" : "national";
  const sort = sp.sort === "popular" ? "popular" : "latest";
  const categoryParam = typeof sp.category === "string" ? sp.category : "";
  const categoryId = categoryParam ? Number(categoryParam) : undefined;

  const [articles, categories] = await Promise.all([
    getNewsByScope({ scope, sort, categoryId }),
    getNewsCategories(scope),
  ]);

  const scopeHref = (nextScope: string) => {
    const params = new URLSearchParams();
    if (nextScope !== "national") params.set("scope", nextScope);
    if (sort !== "latest") params.set("sort", sort);
    if (categoryParam) params.set("category", categoryParam);
    const qs = params.toString();
    return `/news${qs ? `?${qs}` : ""}`;
  };

  const sortHref = (nextSort: string) => {
    const params = new URLSearchParams();
    if (scope !== "national") params.set("scope", scope);
    if (nextSort !== "latest") params.set("sort", nextSort);
    if (categoryParam) params.set("category", categoryParam);
    const qs = params.toString();
    return `/news${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="max-w-2xl">
        <div className="flex items-center gap-2 text-brand">
          <NewspaperIcon className="h-6 w-6" />
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">News</h1>
        </div>
        <p className="mt-2 text-ink-soft">
          National and international stories that matter.
        </p>
      </header>

      {/* Primary scope tabs */}
      <div className="mt-6 inline-flex rounded-full bg-pill p-1">
        <a
          href={scopeHref("national")}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200",
            scope === "national" ? "bg-pill-active text-ink shadow-sm" : "text-ink-soft hover:text-ink",
          )}
        >
          National
        </a>
        <a
          href={scopeHref("international")}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200",
            scope === "international"
              ? "bg-pill-active text-ink shadow-sm"
              : "text-ink-soft hover:text-ink",
          )}
        >
          International
        </a>
      </div>

      {/* Secondary controls */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full bg-pill p-1">
          <a
            href={sortHref("latest")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200",
              sort === "latest" ? "bg-pill-active text-ink shadow-sm" : "text-ink-soft hover:text-ink",
            )}
          >
            Latest
          </a>
          <a
            href={sortHref("popular")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200",
              sort === "popular" ? "bg-pill-active text-ink shadow-sm" : "text-ink-soft hover:text-ink",
            )}
          >
            Popular
          </a>
        </div>

        <SelectFilterWrapper
          param="category"
          label="Category"
          value={categoryParam}
          allLabel="All categories"
          options={categories.map((c: any) => ({ value: String(c.id), label: c.name }))}
        />
      </div>

      {/* Content */}
      <div className="mt-8">
        {articles.length === 0 ? (
          <EmptyState
            icon={<NewspaperIcon className="h-10 w-10" />}
            title="No stories found for these filters"
            description="Try a different category or clear the filters to see more news."
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {articles.map((article: any) => (
              <NewsCard key={article.id} article={article} variant="wide" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
