import Link from "next/link";
import { Avatar } from "@/components/avatar";
import {
  BuildingIcon,
  EyeIcon,
  HeartIcon,
  MessageIcon,
  PinIcon,
} from "@/components/icons";
import { SmartImage } from "@/components/image";
import { Badge } from "@/components/ui";
import type { CommunityPostWithRelations } from "@/lib/types";
import { cn, formatNumber, timeAgo } from "@/lib/utils";

function LocationLine({ post }: { post: CommunityPostWithRelations }) {
  const parts = [post.city, post.state].filter(Boolean);
  if (parts.length === 0 && !post.localArea) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-ink-faint">
      <PinIcon className="h-3.5 w-3.5" />
      {post.localArea ? `${post.localArea}, ` : ""}
      {parts.join(", ")}
    </span>
  );
}

export function CommunityCard({
  post,
  className,
}: {
  post: CommunityPostWithRelations;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-line transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center gap-3 p-4 pb-3">
        <Avatar name={post.author.name} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Link
              href="/profile"
              className="truncate text-sm font-semibold text-ink transition-colors hover:text-brand"
            >
              {post.author.name}
            </Link>
            {post.status === "pending" ? (
              <Badge tone="neutral">Pending</Badge>
            ) : null}
          </div>
          <p className="text-xs text-ink-faint">{timeAgo(post.createdAt)}</p>
        </div>
        {post.category ? (
          <Badge tone={post.category.name === "College" ? "community" : "neutral"}>
            {post.category.name}
          </Badge>
        ) : null}
      </div>

      <Link href={`/community/${post.slug}`} className="px-4">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-ink transition-colors duration-200 group-hover:text-brand">
          {post.title}
        </h3>
        {post.description ? (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {post.description}
          </p>
        ) : null}
      </Link>

      {post.images[0] ? (
        <Link href={`/community/${post.slug}`} className="mt-3 block px-4">
          <SmartImage
            src={post.images[0]}
            alt={post.title}
            className="aspect-[16/9] w-full rounded-xl"
            imgClassName="transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 pb-3 text-xs text-ink-faint">
        <LocationLine post={post} />
        {post.college ? (
          <Link
            href={`/colleges/${post.college.slug}`}
            className="inline-flex items-center gap-1 font-medium text-community transition-colors hover:text-community-ink"
          >
            <BuildingIcon className="h-3.5 w-3.5" />
            {post.college.name}
          </Link>
        ) : null}
      </div>

      <div className="mt-auto flex items-center gap-5 border-t border-line px-4 py-3 text-xs font-medium text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <EyeIcon className="h-4 w-4 text-ink-faint" />
          {formatNumber(post.views)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <HeartIcon className="h-4 w-4 text-ink-faint" />
          {formatNumber(post.likesCount)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MessageIcon className="h-4 w-4 text-ink-faint" />
          {formatNumber(post.commentsCount)}
        </span>
      </div>
    </article>
  );
}
