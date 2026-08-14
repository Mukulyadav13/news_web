import Link from "next/link";
import { BreakingStrip } from "@/components/breaking-strip";
import { CommunityCard } from "@/components/community-card";
import { FlameIcon, GraduationIcon, PlusIcon, TrendingUpIcon } from "@/components/icons";
import { NewsCard } from "@/components/news-card";
import { SectionHeading } from "@/components/ui";
import {
  getBreakingNews,
  getCollegeCommunity,
  getFeaturedNews,
  getLatestMixedNews,
  getNewsByScope,
  getPopularCommunity,
  getTrendingCommunity,
} from "@/lib/queries";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [breaking, featured, latest, national, international, trending, college, popular] =
    await Promise.all([
      getBreakingNews(),
      getFeaturedNews(),
      getLatestMixedNews(6),
      getNewsByScope({ scope: "national", sort: "popular" }),
      getNewsByScope({ scope: "international", sort: "popular" }),
      getTrendingCommunity(4),
      getCollegeCommunity(4),
      getPopularCommunity(4),
    ]);

  const hero = featured[0];
  const secondary = featured.slice(1, 5);

  return (
    <div>
      <BreakingStrip articles={breaking} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ---------------- Featured ---------------- */}
        <section className="py-8 sm:py-10">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-brand" />
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
              What is happening right now
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            {hero ? (
              <NewsCard article={hero} variant="hero" />
            ) : (
              <div className="skeleton aspect-[16/9] rounded-2xl" />
            )}

            <div className="flex flex-col gap-1 rounded-2xl bg-surface p-3 shadow-sm ring-1 ring-line">
              <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-ink-faint">
                Top stories
              </p>
              <div className="divide-y divide-line">
                {secondary.map((article: any) => (
                  <NewsCard key={article.id} article={article} variant="row" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Latest News ---------------- */}
        <section className="py-10">
          <SectionHeading title="Latest News" eyebrow="Just in" actionLabel="View all" actionHref="/news" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((article: any) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* ---------------- National / International ---------------- */}
        <section className="grid gap-6 py-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-line sm:p-6">
            <SectionHeading
              title="National"
              eyebrow="India"
              actionLabel="View All"
              actionHref="/news?scope=national"
            />
            <div className="mt-4 divide-y divide-line">
              {national.slice(0, 4).map((article: any) => (
                <NewsCard key={article.id} article={article} variant="row" />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-line sm:p-6">
            <SectionHeading
              title="International"
              eyebrow="World"
              actionLabel="View All"
              actionHref="/news?scope=international"
            />
            <div className="mt-4 divide-y divide-line">
              {international.slice(0, 4).map((article: any) => (
                <NewsCard key={article.id} article={article} variant="row" />
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Community ---------------- */}
        <section className="py-10">
          <div className="rounded-3xl border border-community/10 bg-gradient-to-br from-community-soft/50 to-surface p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-community">
                  Community
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink">
                  Stories shared by people
                </h2>
                <p className="mt-1.5 max-w-xl text-sm text-ink-soft">
                  Discover what your city, campus and neighbours are talking about.
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href="/community/new"
                  className="inline-flex items-center gap-1.5 rounded-full bg-community px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-community-dark"
                >
                  <PlusIcon className="h-4 w-4" />
                  Share your story
                </Link>
                <Link
                  href="/community"
                  className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-muted"
                >
                  View Community
                </Link>
              </div>
            </div>

            {/* Trending community */}
            <div className="mt-7">
              <h3 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-ink">
                <FlameIcon className="h-4 w-4 text-brand" />
                Trending community
              </h3>
              <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {trending.map((post: any) => (
                  <CommunityCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            {/* College community */}
            <div className="mt-8">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-ink">
                  <GraduationIcon className="h-4 w-4 text-community" />
                  College community
                </h3>
                <Link
                  href="/community"
                  className="text-xs font-semibold text-community transition-colors hover:text-community-ink"
                >
                  Explore in Community →
                </Link>
              </div>
              <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {college.map((post: any) => (
                  <CommunityCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            {/* Popular / most discussed */}
            <div className="mt-8">
              <h3 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-ink">
                <TrendingUpIcon className="h-4 w-4 text-ink-faint" />
                Most discussed
              </h3>
              <ol className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {popular.map((post: any, index: number) => (
                  <li key={post.id}>
                    <Link
                      href={`/community/${post.slug}`}
                      className="group flex items-start gap-3 rounded-xl border border-line bg-surface p-3 transition-colors duration-200 hover:border-line-strong"
                    >
                      <span className="text-2xl font-black text-ink-ghost transition-colors duration-200 group-hover:text-brand">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-brand">
                          {post.title}
                        </p>
                        <p className="mt-1 text-xs text-ink-faint">
                          {formatNumber(post.commentsCount)} comments
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
