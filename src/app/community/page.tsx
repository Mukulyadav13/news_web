import type { Metadata } from "next";
import Link from "next/link";
import { CommunityCard } from "@/components/community-card";
import { CommunityFilterBar } from "@/components/filters";
import { PlusIcon, UsersIcon } from "@/components/icons";
import { EmptyState } from "@/components/ui";
import { COMMUNITY_SORTS } from "@/lib/constants";
import {
  getCommunityCategories,
  getCommunityFilterOptions,
  getCommunityPosts,
} from "@/lib/queries";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const VALID_SORTS = new Set<string>(COMMUNITY_SORTS.map((s) => s.key));

export default async function CommunityPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const sortParam = typeof sp.sort === "string" && VALID_SORTS.has(sp.sort) ? sp.sort : "latest";
  const categoryParam = typeof sp.category === "string" ? sp.category : "";
  const stateParam = typeof sp.state === "string" ? sp.state : "";
  const cityParam = typeof sp.city === "string" ? sp.city : "";
  const collegeParam = typeof sp.college === "string" ? sp.college : "";

  const sort = sortParam as (typeof COMMUNITY_SORTS)[number]["key"];
  const categoryId = categoryParam ? Number(categoryParam) : undefined;
  const collegeId = collegeParam ? Number(collegeParam) : undefined;

  const [posts, filterOptions, categories] = await Promise.all([
    getCommunityPosts({
      sort,
      categoryId,
      state: stateParam || undefined,
      city: cityParam || undefined,
      collegeId,
    }),
    getCommunityFilterOptions(),
    getCommunityCategories(),
  ]);

  const activeCollegeInfo = collegeId
    ? filterOptions.colleges.find((c: any) => c.id === collegeId) ?? null
    : null;

  const sortHref = (next: string) => {
    const params = new URLSearchParams();
    if (next !== "latest") params.set("sort", next);
    if (categoryParam) params.set("category", categoryParam);
    if (stateParam) params.set("state", stateParam);
    if (cityParam) params.set("city", cityParam);
    if (collegeParam) params.set("college", collegeParam);
    const qs = params.toString();
    return `/community${qs ? `?${qs}` : ""}`;
  };

  const clearCollegeHref = () => {
    const params = new URLSearchParams();
    if (sort !== "latest") params.set("sort", sort);
    if (categoryParam) params.set("category", categoryParam);
    if (stateParam) params.set("state", stateParam);
    if (cityParam) params.set("city", cityParam);
    const qs = params.toString();
    return `/community${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-community">
            <UsersIcon className="h-6 w-6" />
            <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Community
            </h1>
          </div>
          <p className="mt-2 text-ink-soft">
            Stories, updates and experiences shared by people.
          </p>
        </div>
        <Link
          href="/community/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md"
        >
          <PlusIcon className="h-4 w-4" />
          Share your story
        </Link>
      </header>

      {/* Sort controls */}
      <div className="no-scrollbar mt-6 inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-pill p-1">
        {COMMUNITY_SORTS.map((item) => (
          <a
            key={item.key}
            href={sortHref(item.key)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
              sort === item.key
                ? "bg-pill-active text-ink shadow-sm"
                : "text-ink-soft hover:text-ink",
            )}
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-4">
        <CommunityFilterBar
          current={{
            category: categoryParam,
            state: stateParam,
            city: cityParam,
            college: collegeParam,
          }}
          categories={categories}
          states={filterOptions.states}
          cities={filterOptions.cities}
          colleges={filterOptions.colleges}
        />
      </div>

      {activeCollegeInfo ? (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-community/20 bg-community-soft/40 px-4 py-3">
          <p className="text-sm text-ink">
            Showing stories from{" "}
            <Link
              href={`/colleges/${activeCollegeInfo.slug}`}
              className="font-semibold text-community-ink hover:underline"
            >
              {activeCollegeInfo.name}
            </Link>
          </p>
          <Link href={clearCollegeHref()} className="text-xs font-semibold text-ink-faint hover:text-ink">
            Clear
          </Link>
        </div>
      ) : null}

      {/* Content */}
      <div className="mt-7">
        {posts.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="h-10 w-10" />}
            title="No posts found for these filters"
            description="Try changing or clearing the filters, or be the first to share a story."
            action={
              <Link
                href="/community/new"
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Share your story
              </Link>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <CommunityCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
