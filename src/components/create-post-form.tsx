"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckIcon,
  ChevronRightIcon,
  GraduationIcon,
  ImageIcon,
  PinIcon,
  PlusIcon,
  TagIcon,
  XIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";

type CollegeOption = { id: number; name: string; slug: string; state: string; city: string };

const STEPS = ["What happened?", "Where?", "What is it about?", "Add photos", "Preview"];

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read error"));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxW = 1200;
        let { width, height } = img;
        if (width > maxW) {
          height = Math.round((height * maxW) / width);
          width = maxW;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = () => resolve(String(reader.result));
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function CreatePostForm({
  categories,
  colleges,
  states,
}: {
  categories: { id: number; name: string }[];
  colleges: CollegeOption[];
  states: string[];
}) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [localArea, setLocalArea] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [collegeState, setCollegeState] = useState("");
  const [collegeCity, setCollegeCity] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const selectedCategory = categories.find((c) => String(c.id) === categoryId);
  const isCollege = selectedCategory?.name === "College";

  const filteredColleges = colleges.filter((c) => {
    if (collegeState && c.state !== collegeState) return false;
    if (collegeCity && !c.city.toLowerCase().includes(collegeCity.toLowerCase())) return false;
    return true;
  });

  function next() {
    setError("");
    if (step === 1 && !title.trim()) {
      setError("Please add a title to continue.");
      return;
    }
    setStep((s) => Math.min(5, s + 1));
  }
  function back() {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  }

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    const remaining = 6 - images.length;
    const list = Array.from(files).slice(0, remaining);
    const results: string[] = [];
    for (const file of list) {
      try {
        results.push(await fileToDataUrl(file));
      } catch {
        /* skip unreadable file */
      }
    }
    setImages((prev) => [...prev, ...results].slice(0, 6));
    setUploading(false);
  }

  function move(index: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          content: description,
          state: state || undefined,
          city: city || undefined,
          localArea: localArea || undefined,
          categoryId: categoryId ? Number(categoryId) : null,
          collegeId: collegeId ? Number(collegeId) : null,
          images,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl bg-surface p-8 text-center shadow-sm ring-1 ring-line">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success">
          <CheckIcon className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-ink">Submitted for review</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Your story will be reviewed before publication. You can track it under{" "}
          <span className="font-semibold text-ink">My Posts</span> in your profile.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/community"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Back to Community
          </Link>
          <Link
            href="/profile?tab=posts"
            className="rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-muted"
          >
            View my posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-ink">
            Step {step} of {STEPS.length}
          </span>
          <span className="text-ink-faint">{STEPS[step - 1]}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted-2">
          <div
            className="h-full rounded-full bg-brand transition-all duration-300"
            style={{ width: `${(step / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-line sm:p-7">
        {step === 1 && (
          <div className="space-y-4">
            <StepTitle icon={<TagIcon className="h-5 w-5" />} title="What happened?" />
            <Field label="Title" required>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                placeholder="A short, clear headline for your story"
                className="input-base"
              />
              <p className="mt-1 text-right text-xs text-ink-faint">{title.length}/200</p>
            </Field>
            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Share the details — what happened, who was involved, why it matters…"
                className="input-base resize-none"
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <StepTitle icon={<PinIcon className="h-5 w-5" />} title="Where did it happen?" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="State">
                <select value={state} onChange={(e) => setState(e.target.value)} className="input-base">
                  <option value="">Select state</option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="City">
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lucknow"
                  className="input-base"
                />
              </Field>
            </div>
            <Field label="Local area (optional)">
              <input
                value={localArea}
                onChange={(e) => setLocalArea(e.target.value)}
                placeholder="e.g. Hazratganj"
                className="input-base"
              />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <StepTitle icon={<GraduationIcon className="h-5 w-5" />} title="What is it about?" />
            <Field label="Category (optional)">
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-base">
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            {isCollege ? (
              <div className="rounded-xl border border-community/20 bg-community-soft/40 p-4">
                <p className="mb-3 text-sm font-semibold text-community-ink">
                  Select your college
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="State">
                    <select
                      value={collegeState}
                      onChange={(e) => {
                        setCollegeState(e.target.value);
                        setCollegeId("");
                      }}
                      className="input-base"
                    >
                      <option value="">Select state</option>
                      {states.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="City">
                    <input
                      value={collegeCity}
                      onChange={(e) => {
                        setCollegeCity(e.target.value);
                        setCollegeId("");
                      }}
                      placeholder="e.g. Prayagraj"
                      className="input-base"
                    />
                  </Field>
                </div>
                <div className="mt-3">
                  <Field label="College">
                    <select value={collegeId} onChange={(e) => setCollegeId(e.target.value)} className="input-base">
                      <option value="">Select college</option>
                      {filteredColleges.map((c) => (
                        <option key={c.id} value={String(c.id)}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                {collegeState && filteredColleges.length === 0 ? (
                  <p className="mt-2 text-xs text-ink-faint">
                    No colleges found for this state/city. You can still publish without a college.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <StepTitle icon={<ImageIcon className="h-5 w-5" />} title="Add photos" />
            <p className="text-sm text-ink-soft">
              Photos make your story stand out. You can add up to 6.
            </p>

            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line-strong bg-muted px-4 py-8 text-center transition-colors hover:border-line-strong">
              <PlusIcon className="h-6 w-6 text-ink-faint" />
              <span className="text-sm font-semibold text-ink">
                {uploading ? "Processing…" : "Add photos"}
              </span>
              <span className="text-xs text-ink-faint">Tap to choose from your device</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
                disabled={uploading || images.length >= 6}
              />
            </label>

            {images.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {images.map((src, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remove photo"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                    <div className="absolute bottom-1 left-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white disabled:opacity-40"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, 1)}
                        disabled={i === images.length - 1}
                        className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white disabled:opacity-40"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <StepTitle icon={<CheckIcon className="h-5 w-5" />} title="Preview" />
            <div className="overflow-hidden rounded-xl border border-line-strong">
              <div className="border-b border-line p-4">
                <h2 className="text-xl font-bold leading-snug text-ink">
                  {title || "Untitled story"}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-faint">
                  {state || city ? (
                    <span className="inline-flex items-center gap-1">
                      <PinIcon className="h-3.5 w-3.5" />
                      {[localArea, city, state].filter(Boolean).join(", ")}
                    </span>
                  ) : null}
                  {selectedCategory ? (
                    <span className="rounded-full bg-pill px-2 py-0.5 font-semibold uppercase tracking-wide text-ink-soft">
                      {selectedCategory.name}
                    </span>
                  ) : null}
                </div>
                {description ? (
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                    {description}
                  </p>
                ) : null}
                {collegeId ? (
                  <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-community">
                    <GraduationIcon className="h-4 w-4" />
                    {colleges.find((c) => String(c.id) === collegeId)?.name}
                  </p>
                ) : null}
              </div>
              {images.length > 0 ? (
                <div className={cn("grid gap-1", images.length > 1 && "grid-cols-2")}>
                  {images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={src} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
                  ))}
                </div>
              ) : null}
            </div>
            <p className="text-sm text-ink-faint">
              Your story will be reviewed before publication.
            </p>
          </div>
        )}

        {error ? (
          <p className="mt-4 rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand-ink">{error}</p>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={back}
              className="rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-muted"
            >
              Back
            </button>
          ) : (
            <span />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Continue
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit for review"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
        {icon}
      </span>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {required ? <span className="text-brand"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
