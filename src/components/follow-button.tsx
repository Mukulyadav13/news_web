"use client";

import { useTransition, useState } from "react";
import { toggleFollowCollege } from "@/lib/actions";
import { cn, formatNumber } from "@/lib/utils";

export function FollowButton({
  collegeId,
  initialFollowing,
  followers,
}: {
  collegeId: number;
  initialFollowing: boolean;
  followers: number;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(followers);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleFollowCollege(collegeId);
      setFollowing(result.following);
      setCount((c) => Math.max(0, c + (result.following ? 1 : -1)));
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className={cn(
          "rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus-ring disabled:opacity-60",
          following
            ? "border border-line-strong bg-surface text-ink hover:border-line-strong"
            : "bg-brand text-white hover:bg-brand-dark",
        )}
      >
        {following ? "Following" : "Follow"}
      </button>
      <span className="text-sm text-ink-faint">{formatNumber(count)} followers</span>
    </div>
  );
}
