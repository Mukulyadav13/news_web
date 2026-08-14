import Link from "next/link";
import { BbcRankings } from "@/components/bbc-rankings";
import { BreakingStrip } from "@/components/breaking-strip";
import { CommunityCard } from "@/components/community-card";
import { FlameIcon, GraduationIcon, PlusIcon, TrendingUpIcon } from "@/components/icons";
import { NewsCard } from "@/components/news-card";
import { SectionHeading } from "@/components/ui";
import {
  getBreakingNews,
  getCollegeCommunity,
  getFeaturedNews,
  getNewsByScope,
  getPopularCommunity,
  getTrendingCommunity,
} from "@/lib/queries";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [breaking, featured, national, international, trending, college, popular] =
    await Promise.all([
      getBreakingNews(),
      getFeaturedNews(),
      getNewsByScope({ scope: "national", sort: "popular" }),
      getNewsByScope({ scope: "international", sort: "popular" }),
      getTrendingCommunity(4),
      getCollegeCommunity(4),
      getPopularCommunity(4),
    ]);

  // Main page shows strictly top featured / important articles
  const hero = featured[0];
  const secondary = featured.slice(1, 5);
  const importantArticles = featured.filter((a: any) => a.isFeatured || a.isBreaking).slice(5, 11);

  return (
    <div>
      <BreakingStrip articles={breaking} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ---------------- GENZ Top Stories Hero & Sidebar ---------------- */}
        <section className="py-8 sm:py-10">
          <div className="mb-4 flex items-center gap-2 border-b border-brand pb-2">
            <span className="h-4 w-2 bg-brand" />
            <h2 className="text-sm font-black uppercase tracking-widest text-brand">
              GENZ Top Stories
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
            {/* Left Main Hero & Secondary Stories */}
            <div className="space-y-6">
              {hero ? (
                <NewsCard article={hero} variant="hero" />
              ) : (
                <div className="skeleton aspect-[16/9] rounded-2xl" />
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {secondary.slice(0, 2).map((article: any) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </div>

            {/* Right GENZ Most Read Rankings Sidebar */}
            <div>
              <BbcRankings articles={featured} />
            </div>
          </div>
        </section>

        {/* ---------------- GENZ Features & Analysis ---------------- */}
        <section className="py-8 border-t border-line">
          <SectionHeading title="Features & Analysis" eyebrow="GENZ Editorial" actionLabel="View All News" actionHref="/news" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {importantArticles.map((article: any) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* ---------------- GENZ World & National Dual Columns ---------------- */}
        <section className="grid gap-6 py-8 border-t border-line lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs sm:p-6">
            <SectionHeading
              title="World News"
              eyebrow="International"
              actionLabel="Explore World"
              actionHref="/news?scope=international"
            />
            <div className="mt-4 divide-y divide-line">
              {international.slice(0, 4).map((article: any) => (
                <NewsCard key={article.id} article={article} variant="row" />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs sm:p-6">
            <SectionHeading
              title="National News"
              eyebrow="India"
              actionLabel="Explore National"
              actionHref="/news?scope=national"
            />
            <div className="mt-4 divide-y divide-line">
              {national.slice(0, 4).map((article: any) => (
                <NewsCard key={article.id} article={article} variant="row" />
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- GENZ Community & Campus Hub ---------------- */}
        <section className="py-10 border-t border-line">
          <div className="rounded-3xl border border-community/20 bg-gradient-to-br from-community-soft/60 via-surface to-surface p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-community/15 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-community/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-community">
                  GENZ Add-on Feature
                </div>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-ink sm:text-3xl">
                  GENZ Community & Campus Hub
                </h2>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-soft">
                  Grassroot reporting, student dispatches, local city updates, and campus discussions shared directly by the community.
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href="/community/new"
                  className="inline-flex items-center gap-1.5 rounded-full bg-community px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-community-dark hover:shadow-sm"
                >
                  <PlusIcon className="h-4 w-4" />
                  Post Community Story
                </Link>
                <Link
                  href="/community"
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-muted"
                >
                  View All Posts
                </Link>
              </div>
            </div>

            {/* Trending Community Posts */}
            <div className="mt-8">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-ink">
                <FlameIcon className="h-4 w-4 text-brand" />
                Trending Community Dispatches
              </h3>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {trending.map((post: any) => (
                  <CommunityCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            {/* College Community Posts */}
            <div className="mt-8">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-ink">
                  <GraduationIcon className="h-4 w-4 text-community" />
                  College & University Pulse
                </h3>
                <Link
                  href="/community"
                  className="text-xs font-extrabold uppercase tracking-wider text-community transition-colors hover:text-community-dark"
                >
                  Explore Campus Hub →
                </Link>
              </div>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {college.map((post: any) => (
                  <CommunityCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            {/* Most Discussed Community Threads */}
            <div className="mt-8">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-ink">
                <TrendingUpIcon className="h-4 w-4 text-ink-faint" />
                Most Discussed Threads
              </h3>
              <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {popular.map((post: any, index: number) => (
                  <li key={post.id}>
                    <Link
                      href={`/community/${post.slug}`}
                      className="group flex items-start gap-3 rounded-xl border border-line bg-surface p-3 transition-all hover:border-brand/40 hover:shadow-xs"
                    >
                      <span className="text-2xl font-black text-brand/80 transition-colors group-hover:text-brand">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-xs font-bold leading-snug text-ink transition-colors group-hover:text-brand">
                          {post.title}
                        </p>
                        <p className="mt-1 text-[11px] text-ink-faint">
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
