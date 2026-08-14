import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  eyebrow,
  actionLabel,
  actionHref,
  className,
}: {
  title: string;
  eyebrow?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-xl font-bold tracking-tight text-ink sm:text-2xl">
          {title}
        </h2>
      </div>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-ink-soft transition-colors duration-200 hover:bg-pill hover:text-ink"
        >
          {actionLabel}
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
      {icon ? <div className="mb-4 text-ink-faint">{icon}</div> : null}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-ink-soft">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "brand" | "community" | "neutral" | "breaking";
  className?: string;
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand-soft text-brand-ink",
    community: "bg-community-soft text-community-ink",
    neutral: "bg-pill text-ink-soft",
    breaking: "bg-brand text-white",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function NewsCardSkeleton({ featured = false }: { featured?: boolean }) {
  if (featured) {
    return (
      <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-line">
        <div className="skeleton aspect-[16/9]" />
        <div className="p-5">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton mt-3 h-6 w-full rounded" />
          <div className="skeleton mt-2 h-6 w-2/3 rounded" />
          <div className="skeleton mt-3 h-4 w-3/4 rounded" />
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-line">
      <div className="skeleton aspect-[16/9]" />
      <div className="p-4">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton mt-2 h-5 w-full rounded" />
        <div className="skeleton mt-2 h-5 w-4/5 rounded" />
        <div className="skeleton mt-3 h-3 w-28 rounded" />
      </div>
    </div>
  );
}

export function CommunityCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-line">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="skeleton h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3 w-32 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
        </div>
        <div className="skeleton mt-3 h-5 w-full rounded" />
        <div className="skeleton mt-2 h-5 w-3/4 rounded" />
      </div>
      <div className="skeleton aspect-[16/9]" />
      <div className="flex items-center gap-5 p-4">
        <div className="skeleton h-4 w-14 rounded" />
        <div className="skeleton h-4 w-14 rounded" />
        <div className="skeleton h-4 w-14 rounded" />
      </div>
    </div>
  );
}

export function GridSkeleton({ type }: { type: "news" | "community" }) {
  const Skeleton = type === "news" ? NewsCardSkeleton : CommunityCardSkeleton;
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  );
}
