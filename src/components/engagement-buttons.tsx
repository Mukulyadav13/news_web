"use client";

import { useTransition, useState } from "react";
import { toggleBookmark, toggleLike } from "@/lib/actions";
import {
  BookmarkIcon,
  HeartIcon,
  MessageIcon,
  ShareIcon,
} from "@/components/icons";
import { cn, formatNumber } from "@/lib/utils";

export function EngagementButtons({
  targetType,
  targetId,
  initialLiked,
  initialBookmarked,
  likesCount,
  shareTitle,
  compact = false,
}: {
  targetType: "news" | "community";
  targetId: number;
  initialLiked: boolean;
  initialBookmarked: boolean;
  likesCount: number;
  shareTitle: string;
  compact?: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(likesCount);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleLike() {
    startTransition(async () => {
      const result = await toggleLike(targetType, targetId);
      setLiked(result.liked);
      setLikes((c) => Math.max(0, c + (result.liked ? 1 : -1)));
    });
  }

  function handleBookmark() {
    startTransition(async () => {
      const result = await toggleBookmark(targetType, targetId);
      setBookmarked(result.bookmarked);
    });
  }

  async function handleShare() {
    const url = window.location.href;
    const text = `${shareTitle} — Samachar`;
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const buttonClass = cn(
    "inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-200 focus-ring disabled:opacity-60",
    compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
  );

  return (
    <div className={cn("flex items-center", compact ? "gap-1" : "gap-2")}>
      <button
        type="button"
        onClick={handleLike}
        disabled={isPending}
        className={cn(
          buttonClass,
          liked
            ? "bg-brand-soft text-brand-ink"
            : "bg-pill text-ink-soft hover:bg-line hover:text-ink",
        )}
      >
        <HeartIcon filled={liked} className={cn("h-4 w-4", liked && "scale-110")} />
        <span>{formatNumber(likes)}</span>
      </button>

      <a
        href="#comments"
        className={cn(
          buttonClass,
          "bg-pill text-ink-soft hover:bg-line hover:text-ink",
        )}
      >
        <MessageIcon className="h-4 w-4" />
        <span>Comment</span>
      </a>

      <button
        type="button"
        onClick={handleShare}
        className={cn(
          buttonClass,
          copied
            ? "bg-success-soft text-success"
            : "bg-pill text-ink-soft hover:bg-line hover:text-ink",
        )}
      >
        <ShareIcon className="h-4 w-4" />
        <span>{copied ? "Copied!" : "Share"}</span>
      </button>

      <button
        type="button"
        onClick={handleBookmark}
        disabled={isPending}
        className={cn(
          buttonClass,
          bookmarked
            ? "bg-community-soft text-community-ink"
            : "bg-pill text-ink-soft hover:bg-line hover:text-ink",
        )}
      >
        <BookmarkIcon filled={bookmarked} className="h-4 w-4" />
        <span className={compact ? "sr-only" : undefined}>
          {bookmarked ? "Saved" : "Bookmark"}
        </span>
      </button>
    </div>
  );
}
