import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { CommunityCard } from "@/components/community-card";
import {
  BuildingIcon,
  NewspaperIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
} from "@/components/icons";
import { NewsCard } from "@/components/news-card";
import { EmptyState } from "@/components/ui";
import { searchAll } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const results = q ? await searchAll(q) : null;

  const hasResults = results
    ? results.news.length + results.community.length + results.colleges.length + results.users.length
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Search</h1>
        <p className="mt-2 text-ink-soft">Find news, stories, colleges and people.</p>
        <form action="/search" method="get" className="relative mt-5">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search news, people, colleges…"
            className="w-full rounded-full border border-line-strong bg-surface py-3.5 pl-12 pr-5 text-base text-ink shadow-sm placeholder:text-ink-faint transition-all duration-200 focus:border-brand/40 focus:outline-none focus:ring-4 focus:ring-brand/10"
          />
        </form>
      </header>

      <div className="mt-10">
        {!q ? (
          <EmptyState
            icon={<SearchIcon className="h-10 w-10" />}
            title="Search across Samachar"
            description="Try searching for a topic, a city, a college name like “MNNIT”, or a person."
          />
        ) : hasResults === 0 ? (
          <EmptyState
            icon={<SearchIcon className="h-10 w-10" />}
            title={`No results for “${q}”`}
            description="Try a different spelling or a broader search term."
          />
        ) : (
          <div className="space-y-12">
            {results!.news.length > 0 ? (
              <section>
                <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                  <NewspaperIcon className="h-5 w-5 text-brand" />
                  News
                  <span className="text-sm font-medium text-ink-faint">
                    ({results!.news.length})
                  </span>
                </h2>
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {results!.news.map((article: any) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            ) : null}

            {results!.community.length > 0 ? (
              <section>
                <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                  <UsersIcon className="h-5 w-5 text-community" />
                  Community
                  <span className="text-sm font-medium text-ink-faint">
                    ({results!.community.length})
                  </span>
                </h2>
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {results!.community.map((post: any) => (
                    <CommunityCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            ) : null}

            {results!.colleges.length > 0 ? (
              <section>
                <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                  <BuildingIcon className="h-5 w-5 text-community" />
                  Colleges
                  <span className="text-sm font-medium text-ink-faint">
                    ({results!.colleges.length})
                  </span>
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {results!.colleges.map((college: any) => (
                    <Link
                      key={college.id}
                      href={`/colleges/${college.slug}`}
                      className="group flex items-center gap-3 rounded-xl border border-line bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-sm"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-community-soft text-community">
                        <BuildingIcon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-ink transition-colors group-hover:text-community">
                          {college.name}
                        </span>
                        <span className="block text-sm text-ink-faint">
                          {college.city}, {college.state}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {results!.users.length > 0 ? (
              <section>
                <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                  <UserIcon className="h-5 w-5 text-ink-faint" />
                  People
                  <span className="text-sm font-medium text-ink-faint">
                    ({results!.users.length})
                  </span>
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {results!.users.map((user: any) => (
                    <Link
                      key={user.id}
                      href="/profile"
                      className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-sm"
                    >
                      <Avatar name={user.name} size="md" />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-ink">{user.name}</span>
                        <span className="block truncate text-sm text-ink-faint">
                          @{user.username}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
