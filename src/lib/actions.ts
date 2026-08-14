"use server";

import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  bookmarks,
  comments,
  communityPosts,
  follows,
  likes,
  newsArticles,
  notifications,
  users,
} from "@/db/schema";
import { DEMO_USER_ID } from "@/lib/constants";

function revalidateEngagement(targetType: string) {
  revalidatePath("/");
  revalidatePath("/community");
  revalidatePath("/news");
  if (targetType === "community") {
    revalidatePath("/community/[slug]");
    revalidatePath("/colleges/[slug]");
  } else {
    revalidatePath("/news/[slug]");
  }
  revalidatePath("/profile");
}

/* ------------------------------- Likes ---------------------------- */
export async function toggleLike(
  targetType: "news" | "community",
  targetId: number,
): Promise<{ liked: boolean }> {
  const userId = DEMO_USER_ID;
  const existing = await db
    .select({ id: likes.id })
    .from(likes)
    .where(
      and(
        eq(likes.userId, userId),
        eq(likes.targetType, targetType),
        eq(likes.targetId, targetId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(likes)
      .where(
        and(
          eq(likes.userId, userId),
          eq(likes.targetType, targetType),
          eq(likes.targetId, targetId),
        ),
      );
    if (targetType === "community") {
      await db
        .update(communityPosts)
        .set({ likesCount: sql`GREATEST(0, ${communityPosts.likesCount} - 1)` })
        .where(eq(communityPosts.id, targetId));
    } else {
      await db
        .update(newsArticles)
        .set({ likesCount: sql`GREATEST(0, ${newsArticles.likesCount} - 1)` })
        .where(eq(newsArticles.id, targetId));
    }
    revalidateEngagement(targetType);
    return { liked: false };
  }

  await db.insert(likes).values({ userId, targetType, targetId });
  if (targetType === "community") {
    await db
      .update(communityPosts)
      .set({ likesCount: sql`${communityPosts.likesCount} + 1` })
      .where(eq(communityPosts.id, targetId));
  } else {
    await db
      .update(newsArticles)
      .set({ likesCount: sql`${newsArticles.likesCount} + 1` })
      .where(eq(newsArticles.id, targetId));
  }
  revalidateEngagement(targetType);
  return { liked: true };
}

/* ----------------------------- Bookmarks -------------------------- */
export async function toggleBookmark(
  targetType: "news" | "community",
  targetId: number,
): Promise<{ bookmarked: boolean }> {
  const userId = DEMO_USER_ID;
  const existing = await db
    .select({ id: bookmarks.id })
    .from(bookmarks)
    .where(
      and(
        eq(bookmarks.userId, userId),
        eq(bookmarks.targetType, targetType),
        eq(bookmarks.targetId, targetId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.targetType, targetType),
          eq(bookmarks.targetId, targetId),
        ),
      );
    if (targetType === "community") {
      await db
        .update(communityPosts)
        .set({ bookmarksCount: sql`GREATEST(0, ${communityPosts.bookmarksCount} - 1)` })
        .where(eq(communityPosts.id, targetId));
    }
    revalidateEngagement(targetType);
    return { bookmarked: false };
  }

  await db.insert(bookmarks).values({ userId, targetType, targetId });
  if (targetType === "community") {
    await db
      .update(communityPosts)
      .set({ bookmarksCount: sql`${communityPosts.bookmarksCount} + 1` })
      .where(eq(communityPosts.id, targetId));
  }
  revalidateEngagement(targetType);
  return { bookmarked: true };
}

/* ------------------------------ Comments -------------------------- */
export async function addComment(
  targetType: "news" | "community",
  targetId: number,
  content: string,
): Promise<{ ok: boolean; error?: string }> {
  const trimmed = content.trim();
  if (!trimmed) return { ok: false, error: "Please write a comment." };
  if (trimmed.length > 1000) return { ok: false, error: "Comment is too long." };

  await db
    .insert(comments)
    .values({ targetType, targetId, authorId: DEMO_USER_ID, content: trimmed });

  if (targetType === "community") {
    await db
      .update(communityPosts)
      .set({ commentsCount: sql`${communityPosts.commentsCount} + 1` })
      .where(eq(communityPosts.id, targetId));
  } else {
    await db
      .update(newsArticles)
      .set({ commentsCount: sql`${newsArticles.commentsCount} + 1` })
      .where(eq(newsArticles.id, targetId));
  }

  revalidateEngagement(targetType);
  return { ok: true };
}

/* ------------------------------ Follows --------------------------- */
export async function toggleFollowCollege(
  collegeId: number,
): Promise<{ following: boolean }> {
  const userId = DEMO_USER_ID;
  const existing = await db
    .select({ id: follows.id })
    .from(follows)
    .where(
      and(
        eq(follows.userId, userId),
        eq(follows.targetType, "college"),
        eq(follows.targetId, collegeId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(follows)
      .where(
        and(
          eq(follows.userId, userId),
          eq(follows.targetType, "college"),
          eq(follows.targetId, collegeId),
        ),
      );
    revalidatePath("/colleges/[slug]");
    revalidatePath("/profile");
    return { following: false };
  }

  await db.insert(follows).values({ userId, targetType: "college", targetId: collegeId });
  revalidatePath("/colleges/[slug]");
  revalidatePath("/profile");
  return { following: true };
}

/* --------------------------- Notifications ------------------------ */
export async function markAllNotificationsRead(): Promise<void> {
  await db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.userId, DEMO_USER_ID));
  revalidatePath("/profile");
}

/* ------------------------------ Profile --------------------------- */
export async function updateProfile(input: {
  name: string;
  bio: string;
}): Promise<{ ok: boolean; error?: string }> {
  const name = input.name.trim();
  if (!name) return { ok: false, error: "Name cannot be empty." };
  await db
    .update(users)
    .set({ name, bio: input.bio.trim() })
    .where(eq(users.id, DEMO_USER_ID));
  revalidatePath("/profile");
  return { ok: true };
}
