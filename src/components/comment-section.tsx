"use client";

import { useState } from "react";
import { Avatar } from "@/components/avatar";
import { MessageIcon } from "@/components/icons";
import { addComment } from "@/lib/actions";
import { DEMO_USER } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";

type CommentItem = {
  id: number;
  content: string;
  createdAt: Date | string;
  author: { id: number; name: string; username: string };
};

export function CommentSection({
  targetType,
  targetId,
  comments: initialComments,
}: {
  targetType: "news" | "community";
  targetId: number;
  comments: CommentItem[];
}) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!text.trim()) {
      setError("Please write a comment.");
      return;
    }
    setSubmitting(true);
    setError("");
    const result = await addComment(targetType, targetId, text);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }
    setComments((prev) => [
      {
        id: Date.now(),
        content: text.trim(),
        createdAt: new Date(),
        author: {
          id: 1,
          name: DEMO_USER.name,
          username: DEMO_USER.username,
        },
      },
      ...prev,
    ]);
    setText("");
  }

  return (
    <section id="comments" className="scroll-mt-24">
      <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
        <MessageIcon className="h-5 w-5 text-ink-faint" />
        Comments
        <span className="text-sm font-medium text-ink-faint">({comments.length})</span>
      </h2>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-3">
          <Avatar name={DEMO_USER.name} size="sm" />
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="Add a comment…"
              className="w-full resize-none rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-colors duration-200 focus:border-brand/40 focus:outline-none focus:ring-4 focus:ring-brand/10"
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-ink-faint">{error || "Be respectful and on-topic."}</p>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-dark disabled:opacity-60"
              >
                {submitting ? "Posting…" : "Post comment"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="mt-6 space-y-5">
        {comments.length === 0 ? (
          <p className="rounded-xl bg-muted px-4 py-6 text-center text-sm text-ink-soft">
            No comments yet. Be the first to share your thoughts.
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar name={comment.author.name} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-ink">
                    {comment.author.name}
                  </span>
                  <span className="text-xs text-ink-faint">
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="mt-0.5 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
