import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { CommentSection } from "@/components/comment-section";
import { CommunityCard } from "@/components/community-card";
import { EngagementButtons } from "@/components/engagement-buttons";
import { BuildingIcon, ChevronRightIcon, PinIcon } from "@/components/icons";
import { SmartImage } from "@/components/image";
import { Badge, SectionHeading } from "@/components/ui";
import { DEMO_USER_ID } from "@/lib/constants";
import {
  getComments,
  getCommunityPost,
  getRelatedCommunityPosts,
  hasBookmarked,
  hasLiked,
} from "@/lib/queries";
import { formatDateTime, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCommunityPost(slug);
  return { title: post ? post.title : "Community" };
}

export default async function CommunityPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getCommunityPost(slug);
  if (!post) notFound();

  const [comments, liked, bookmarked, related] = await Promise.all([
    getComments("community", post.id),
    hasLiked(DEMO_USER_ID, "community", post.id),
    hasBookmarked(DEMO_USER_ID, "community", post.id),
    getRelatedCommunityPosts(post, 3),
  ]);

  const location = [post.localArea, post.city, post.state].filter(Boolean).join(", ");
  const body = (post.content || post.description || "").split(/\n\n+/).filter(Boolean);

  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <nav className="flex items-center gap-1 text-xs font-medium text-ink-faint">
          <Link href="/community" className="transition-colors hover:text-ink">
            Community
          </Link>
          {post.college ? (
            <>
              <ChevronRightIcon className="h-3 w-3" />
              <Link
                href={`/colleges/${post.college.slug}`}
                className="transition-colors hover:text-ink"
              >
                {post.college.name}
              </Link>
            </>
          ) : null}
        </nav>

        {/* Author */}
        <div className="mt-5 flex items-center gap-3">
          <Avatar name={post.author.name} size="lg" />
          <div>
            <Link href="/profile" className="font-semibold text-ink hover:text-brand">
              {post.author.name}
            </Link>
            <p className="text-sm text-ink-faint">
              {formatDateTime(post.createdAt)} · {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        {post.status === "pending" ? (
          <div className="mt-4 rounded-xl border border-warning/30 bg-warning-soft px-4 py-2.5 text-sm text-warning">
            This story is pending review and is only visible to you.
          </div>
        ) : null}

        <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {post.category ? (
            <Badge tone={post.category.name === "College" ? "community" : "neutral"}>
              {post.category.name}
            </Badge>
          ) : null}
          {location ? (
            <span className="inline-flex items-center gap-1 text-sm text-ink-faint">
              <PinIcon className="h-4 w-4" />
              {location}
            </span>
          ) : null}
          {post.college ? (
            <Link
              href={`/colleges/${post.college.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-community transition-colors hover:text-community-ink"
            >
              <BuildingIcon className="h-4 w-4" />
              {post.college.name}
            </Link>
          ) : null}
        </div>
      </div>

      {/* Gallery */}
      {post.images.length > 0 ? (
        <div className="mx-auto mt-6 max-w-3xl space-y-3">
          <SmartImage
            src={post.images[0]}
            alt={post.title}
            eager
            className="aspect-[16/9] w-full rounded-2xl"
          />
          {post.images.length > 1 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {post.images.slice(1).map((src: string, i: number) => (
                <SmartImage
                  key={i}
                  src={src}
                  alt={`${post.title} — photo ${i + 2}`}
                  className="aspect-square w-full rounded-xl"
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mx-auto mt-6 max-w-3xl">
        {post.description && body.length === 0 ? (
          <p className="text-lg font-medium leading-relaxed text-ink">{post.description}</p>
        ) : (
          <div className="prose-body">
            {body.map((paragraph: string, i: number) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line-strong pt-6">
          <EngagementButtons
            targetType="community"
            targetId={post.id}
            initialLiked={liked}
            initialBookmarked={bookmarked}
            likesCount={post.likesCount}
            shareTitle={post.title}
          />
        </div>

        <div className="mt-10">
          <CommentSection
            targetType="community"
            targetId={post.id}
            comments={comments.map((c: any) => ({
              id: c.id,
              content: c.content,
              createdAt: c.createdAt,
              author: {
                id: c.author.id,
                name: c.author.name,
                username: c.author.username,
              },
            }))}
          />
        </div>
      </div>

      {related.length > 0 ? (
        <div className="mx-auto mt-14 max-w-7xl">
          <SectionHeading
            title={post.college ? `More from ${post.college.name}` : "Related stories"}
            actionLabel="View Community"
            actionHref="/community"
          />
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item: any) => (
              <CommunityCard key={item.id} post={item} />
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
