"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { markAllNotificationsRead, updateProfile } from "@/lib/actions";
import { CheckIcon } from "@/components/icons";

export function MarkAllReadButton({ hasUnread }: { hasUnread: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await markAllNotificationsRead();
      router.refresh();
    });
  }

  if (!hasUnread) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-full border border-line-strong px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-muted disabled:opacity-60"
    >
      {isPending ? "Marking…" : "Mark all read"}
    </button>
  );
}

export function SettingsForm({
  initialName,
  initialBio,
}: {
  initialName: string;
  initialBio: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await updateProfile({ name, bio });
      if (result.ok) {
        setMessage({ ok: true, text: "Profile updated." });
        router.refresh();
      } else {
        setMessage({ ok: false, text: result.error ?? "Something went wrong." });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">Display name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-base"
          placeholder="Your name"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">Bio</span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="input-base resize-none"
          placeholder="A short line about you"
        />
      </label>

      {message ? (
        <p
          className={
            message.ok
              ? "flex items-center gap-1.5 text-sm text-success"
              : "text-sm text-brand"
          }
        >
          {message.ok ? <CheckIcon className="h-4 w-4" /> : null}
          {message.text}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
