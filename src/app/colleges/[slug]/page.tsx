import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommunityCard } from "@/components/community-card";
import { FollowButton } from "@/components/follow-button";
import { BuildingIcon, ChevronRightIcon, PinIcon } from "@/components/icons";
import { SmartImage } from "@/components/image";
import { EmptyState } from "@/components/ui";
import { COMMUNITY_SORTS, DEMO_USER_ID } from "@/lib/constants";
import {
  getCollege,
  getCollegeFollowerCount,
  getCollegePostCount,
  getCommunityPosts,
  isFollowing,
} from "@/lib/queries";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const college = await getCollege(slug);
  return { title: college ? college.name : "College" };
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
const VALID_SORTS = new Set<string>(COMMUNITY_SORTS.map((s) => s.key));

export default async function CollegePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const college = await getCollege(slug);
  if (!college) notFound();

  const sortParam =
    typeof sp.sort === "string" && VALID_SORTS.has(sp.sort) ? sp.sort : "latest";
  const sort = sortParam as (typeof COMMUNITY_SORTS)[number]["key"];

  const [posts, followers, following, postCount] = await Promise.all([
    getCommunityPosts({ sort, collegeId: college.id }),
    getCollegeFollowerCount(college.id),
    isFollowing(DEMO_USER_ID, "college", college.id),
    getCollegePostCount(college.id),
  ]);

  const sortHref = (next: string) => {
    const params = new URLSearchParams();
    if (next !== "latest") params.set("sort", next);
    return `/colleges/${college.slug}${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <nav className="flex items-center gap-1 text-xs font-medium text-ink-faint">
        <Link href="/community" className="transition-colors hover:text-ink">
          Community
        </Link>
        <ChevronRightIcon className="h-3 w-3" />
        <span>College</span>
        <ChevronRightIcon className="h-3 w-3" />
        <span className="truncate">{college.name}</span>
      </nav>

      <header className="mt-5 overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-line">
        {college.imageUrl ? (
          <SmartImage
            src={college.imageUrl}
            alt={college.name}
            eager
            className="h-44 w-full sm:h-56"
          />
        ) : null}
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <BuildingIcon className="h-6 w-6 text-community" />
              <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                {college.name}
              </h1>
            </div>
            <p className="mt-1.5 inline-flex items-center gap-1 text-sm text-ink-faint">
              <PinIcon className="h-4 w-4" />
              {college.city}, {college.state}
            </p>
            {college.description ? (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
                {college.description}
              </p>
            ) : null}
            <p className="mt-3 text-xs font-medium text-ink-faint">
              {postCount} {postCount === 1 ? "story" : "stories"} shared
            </p>
          </div>
          <FollowButton
            collegeId={college.id}
            initialFollowing={following}
            followers={followers}
          />
        </div>
      </header>

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

      <div className="mt-7">
        {posts.length === 0 ? (
          <EmptyState
            icon={<BuildingIcon className="h-10 w-10" />}
            title="No stories yet. Be the first to share one."
            description={`Nothing has been shared from ${college.name} under this view yet.`}
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
