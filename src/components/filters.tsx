"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronDownIcon, XIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

function useFilterNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function apply(param: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(param, value);
    else params.delete(param);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    ["category", "state", "city", "college"].forEach((p) => params.delete(p));
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return { apply, clearAll };
}

function SelectShell({
  label,
  value,
  children,
  onChange,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <label className="group relative block min-w-0 flex-1 sm:flex-none">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-wider text-ink-faint">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none rounded-xl border border-line-strong bg-surface py-2.5 pl-3 pr-9 text-sm font-medium text-ink transition-colors duration-200 hover:border-line-strong focus:border-brand/40 focus:outline-none focus:ring-4 focus:ring-brand/10"
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
    </label>
  );
}

export function SelectFilter({
  param,
  label,
  value,
  options,
  allLabel = "All",
  className,
}: {
  param: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  allLabel?: string;
  className?: string;
}) {
  const { apply } = useFilterNav();
  return (
    <SelectShell label={label} value={value} onChange={(v) => apply(param, v)}>
      <option value="">{allLabel}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </SelectShell>
  );
}

export function CommunityFilterBar({
  current,
  categories,
  states,
  cities,
  colleges,
}: {
  current: { category: string; state: string; city: string; college: string };
  categories: { id: number; name: string }[];
  states: string[];
  cities: string[];
  colleges: { id: number; name: string }[];
}) {
  const { apply, clearAll } = useFilterNav();
  const [open, setOpen] = useState(false);

  const categoryOptions = categories.map((c) => ({
    value: String(c.id),
    label: c.name,
  }));
  const stateOptions = states.map((s) => ({ value: s, label: s }));
  const cityOptions = cities.map((s) => ({ value: s, label: s }));
  const collegeOptions = colleges.map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  const activeCount = [current.category, current.state, current.city, current.college].filter(
    Boolean,
  ).length;

  const selects = (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <SelectShell
        label="Category"
        value={current.category}
        onChange={(v) => apply("category", v)}
      >
        <option value="">All</option>
        {categoryOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </SelectShell>
      <SelectShell label="State" value={current.state} onChange={(v) => apply("state", v)}>
        <option value="">All</option>
        {stateOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </SelectShell>
      <SelectShell label="City" value={current.city} onChange={(v) => apply("city", v)}>
        <option value="">All</option>
        {cityOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </SelectShell>
      <SelectShell label="College" value={current.college} onChange={(v) => apply("college", v)}>
        <option value="">All</option>
        {collegeOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </SelectShell>
    </div>
  );

  return (
    <div>
      {/* Desktop / tablet inline */}
      <div className="hidden items-center gap-2 md:flex">
        {selects}
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-ink-faint transition-colors hover:bg-pill hover:text-ink"
          >
            <XIcon className="h-4 w-4" />
            Clear
          </button>
        ) : null}
      </div>

      {/* Mobile: trigger + bottom sheet */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-line-strong"
        >
          Filters
          {activeCount > 0 ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-bold text-white">
              {activeCount}
            </span>
          ) : null}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-surface p-5 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-2xl">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted-2" />
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-ink">Filter stories</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-pill p-2 text-ink-soft transition-colors hover:text-ink"
                aria-label="Close"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">{selects}</div>
            {activeCount > 0 ? (
              <button
                type="button"
                onClick={clearAll}
                className="mt-3 w-full rounded-xl border border-line-strong py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-muted"
              >
                Clear all filters
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Show results
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SelectFilterWrapper({
  param,
  label,
  value,
  options,
  allLabel,
}: {
  param: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  allLabel?: string;
}) {
  return (
    <SelectFilter
      param={param}
      label={label}
      value={value}
      options={options}
      allLabel={allLabel}
      className="w-44"
    />
  );
}
