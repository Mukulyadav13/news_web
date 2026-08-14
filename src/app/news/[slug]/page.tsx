import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentSection } from "@/components/comment-section";
import { EngagementButtons } from "@/components/engagement-buttons";
import { ChevronRightIcon, ClockIcon, EyeIcon } from "@/components/icons";
import { SmartImage } from "@/components/image";
import { NewsCard } from "@/components/news-card";
import { Badge, SectionHeading } from "@/components/ui";
import { DEMO_USER_ID } from "@/lib/constants";
import {
  getComments,
  getNewsArticle,
  getRelatedNews,
  hasBookmarked,
  hasLiked,
} from "@/lib/queries";
import { formatDateTime, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  return { title: article ? article.title : "News" };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) notFound();

  const [comments, liked, bookmarked, related] = await Promise.all([
    getComments("news", article.id),
    hasLiked(DEMO_USER_ID, "news", article.id),
    hasBookmarked(DEMO_USER_ID, "news", article.id),
    getRelatedNews(article.scope, article.id, 3),
  ]);

  const paragraphs = article.content.split(/\n\n+/).filter(Boolean);

  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs font-medium text-ink-faint">
          <Link href="/news" className="transition-colors hover:text-ink">
            News
          </Link>
          <ChevronRightIcon className="h-3 w-3" />
          <Link
            href={`/news?scope=${article.scope}`}
            className="capitalize transition-colors hover:text-ink"
          >
            {article.scope}
          </Link>
        </nav>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <Badge tone="brand" className="capitalize">
            {article.scope}
          </Badge>
          {article.category ? <Badge tone="neutral">{article.category.name}</Badge> : null}
          {article.isBreaking ? <Badge tone="breaking">Breaking</Badge> : null}
        </div>

        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
          {article.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-line-strong pb-5 text-sm text-ink-faint">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4" />
            {formatDateTime(article.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <EyeIcon className="h-4 w-4" />
            {formatNumber(article.views)} views
          </span>
        </div>
      </div>

      {article.imageUrl ? (
        <div className="mx-auto mt-6 max-w-3xl">
          <SmartImage
            src={article.imageUrl}
            alt={article.title}
            eager
            className="aspect-[16/8] w-full rounded-2xl"
          />
        </div>
      ) : null}

      <div className="mx-auto mt-6 max-w-3xl">
        <p className="text-lg font-medium leading-relaxed text-ink">{article.summary}</p>

        <div className="prose-body mt-6">
          {paragraphs.map((paragraph: string, i: number) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line-strong pt-6">
          <EngagementButtons
            targetType="news"
            targetId={article.id}
            initialLiked={liked}
            initialBookmarked={bookmarked}
            likesCount={article.likesCount}
            shareTitle={article.title}
          />
        </div>

        <div className="mt-10">
          <CommentSection
            targetType="news"
            targetId={article.id}
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
          <SectionHeading title="More news" actionLabel="View all" actionHref="/news" />
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item: any) => (
              <NewsCard key={item.id} article={item} />
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
