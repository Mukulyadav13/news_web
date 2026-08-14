import {
  and,
  desc,
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  or,
  sql,
} from "drizzle-orm";
import { db, ensureDbInitialized } from "@/db";
import {
  bookmarks,
  categories,
  colleges,
  comments,
  communityPosts,
  follows,
  likes,
  newsArticles,
  notifications,
  users,
} from "@/db/schema";
import { DEMO_USER_ID } from "@/lib/constants";

export type CommunitySort =
  | "latest"
  | "trending"
  | "most-viewed"
  | "most-liked"
  | "most-commented";

/* ----------------------------- Current user ------------------------ */
export async function getCurrentUser() {
  await ensureDbInitialized();
  const user = await db.query.users.findFirst({ where: eq(users.id, DEMO_USER_ID) });
  return user ?? null;
}

/* ------------------------------- News ------------------------------ */
export async function getBreakingNews() {
  await ensureDbInitialized();
  return db.query.newsArticles.findMany({
    where: eq(newsArticles.isBreaking, true),
    orderBy: [desc(newsArticles.publishedAt)],
    limit: 5,
  });
}

export async function getFeaturedNews() {
  await ensureDbInitialized();
  return db.query.newsArticles.findMany({
    where: eq(newsArticles.isFeatured, true),
    with: { category: true },
    orderBy: [desc(newsArticles.views)],
    limit: 6,
  });
}

export async function getLatestMixedNews(limit = 8) {
  await ensureDbInitialized();
  return db.query.newsArticles.findMany({
    with: { category: true },
    orderBy: [desc(newsArticles.publishedAt)],
    limit,
  });
}

export async function getNewsCategories(scope: "national" | "international") {
  await ensureDbInitialized();
  return db.query.categories.findMany({
    where: eq(categories.scope, scope),
    orderBy: [categories.sort],
  });
}

export async function getNewsByScope(options: {
  scope: "national" | "international";
  sort?: "latest" | "popular";
  categoryId?: number;
}) {
  await ensureDbInitialized();
  const conditions = [eq(newsArticles.scope, options.scope)];
  if (options.categoryId) {
    conditions.push(eq(newsArticles.categoryId, options.categoryId));
  }
  const orderBy =
    options.sort === "popular"
      ? [desc(newsArticles.views), desc(newsArticles.publishedAt)]
      : [desc(newsArticles.publishedAt)];

  return db.query.newsArticles.findMany({
    where: and(...conditions),
    with: { category: true },
    orderBy,
  });
}

export async function getNewsArticle(slug: string) {
  await ensureDbInitialized();
  return db.query.newsArticles.findFirst({
    where: eq(newsArticles.slug, slug),
    with: { category: true },
  });
}

export async function getRelatedNews(scope: string, excludeId: number, limit = 3) {
  await ensureDbInitialized();
  return db.query.newsArticles.findMany({
    where: and(eq(newsArticles.scope, scope), sql`${newsArticles.id} <> ${excludeId}`),
    with: { category: true },
    orderBy: [desc(newsArticles.publishedAt)],
    limit,
  });
}

/* ----------------------------- Community --------------------------- */
const trendingScore = sql<number>`(
  ${communityPosts.likesCount} * 3 +
  ${communityPosts.commentsCount} * 5 +
  ${communityPosts.views} * 0.1
)`;

function communityOrder(sort: CommunitySort) {
  switch (sort) {
    case "trending":
      return [desc(trendingScore), desc(communityPosts.createdAt)];
    case "most-viewed":
      return [desc(communityPosts.views), desc(communityPosts.createdAt)];
    case "most-liked":
      return [desc(communityPosts.likesCount), desc(communityPosts.createdAt)];
    case "most-commented":
      return [desc(communityPosts.commentsCount), desc(communityPosts.createdAt)];
    default:
      return [desc(communityPosts.createdAt)];
  }
}

export async function getCommunityCategories() {
  await ensureDbInitialized();
  return db.query.categories.findMany({
    where: eq(categories.scope, "community"),
    orderBy: [categories.sort],
  });
}

export async function getCommunityPosts(options: {
  sort?: CommunitySort;
  categoryId?: number;
  state?: string;
  city?: string;
  collegeId?: number;
  limit?: number;
  status?: string;
}) {
  await ensureDbInitialized();
  const conditions = [eq(communityPosts.status, options.status ?? "published")];
  if (options.categoryId) conditions.push(eq(communityPosts.categoryId, options.categoryId));
  if (options.state) conditions.push(eq(communityPosts.state, options.state));
  if (options.city) conditions.push(eq(communityPosts.city, options.city));
  if (options.collegeId) conditions.push(eq(communityPosts.collegeId, options.collegeId));

  return db.query.communityPosts.findMany({
    where: and(...conditions),
    with: { author: true, category: true, college: true },
    orderBy: communityOrder(options.sort ?? "latest"),
    limit: options.limit,
  });
}

export async function getTrendingCommunity(limit = 4) {
  await ensureDbInitialized();
  return db.query.communityPosts.findMany({
    where: eq(communityPosts.status, "published"),
    with: { author: true, category: true, college: true },
    orderBy: communityOrder("trending"),
    limit,
  });
}

export async function getCollegeCommunity(limit = 4) {
  await ensureDbInitialized();
  return db.query.communityPosts.findMany({
    where: and(eq(communityPosts.status, "published"), isNotNull(communityPosts.collegeId)),
    with: { author: true, category: true, college: true },
    orderBy: [desc(communityPosts.createdAt)],
    limit,
  });
}

export async function getPopularCommunity(limit = 4) {
  await ensureDbInitialized();
  return db.query.communityPosts.findMany({
    where: eq(communityPosts.status, "published"),
    with: { author: true, category: true, college: true },
    orderBy: communityOrder("most-commented"),
    limit,
  });
}

export async function getCommunityPost(slug: string) {
  await ensureDbInitialized();
  return db.query.communityPosts.findFirst({
    where: eq(communityPosts.slug, slug),
    with: { author: true, category: true, college: true },
  });
}

export async function getRelatedCommunityPosts(
  post: { id: number; collegeId: number | null; categoryId: number | null },
  limit = 3,
) {
  await ensureDbInitialized();
  const conditions = [eq(communityPosts.status, "published"), sql`${communityPosts.id} <> ${post.id}`];
  if (post.collegeId) {
    conditions.push(eq(communityPosts.collegeId, post.collegeId));
  } else if (post.categoryId) {
    conditions.push(eq(communityPosts.categoryId, post.categoryId));
  }
  return db.query.communityPosts.findMany({
    where: and(...conditions),
    with: { author: true, category: true, college: true },
    orderBy: communityOrder("trending"),
    limit,
  });
}

/* ----------------------------- Colleges --------------------------- */
export async function getColleges() {
  await ensureDbInitialized();
  return db.query.colleges.findMany({ orderBy: [colleges.name] });
}

export async function getCollege(slug: string) {
  await ensureDbInitialized();
  return db.query.colleges.findFirst({ where: eq(colleges.slug, slug) });
}

export async function getCollegePostCount(collegeId: number) {
  await ensureDbInitialized();
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(communityPosts)
    .where(and(eq(communityPosts.collegeId, collegeId), eq(communityPosts.status, "published")));
  return result[0]?.count ?? 0;
}

export async function getCollegeFollowerCount(collegeId: number) {
  await ensureDbInitialized();
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(follows)
    .where(and(eq(follows.targetType, "college"), eq(follows.targetId, collegeId)));
  return result[0]?.count ?? 0;
}

/* ---------------------------- Engagement -------------------------- */
export async function getComments(targetType: "news" | "community", targetId: number) {
  await ensureDbInitialized();
  return db.query.comments.findMany({
    where: and(eq(comments.targetType, targetType), eq(comments.targetId, targetId)),
    with: { author: true },
    orderBy: [desc(comments.createdAt)],
  });
}

export async function getUserLikes(userId: number) {
  await ensureDbInitialized();
  return db
    .select({ targetType: likes.targetType, targetId: likes.targetId })
    .from(likes)
    .where(eq(likes.userId, userId));
}

export async function getUserBookmarks(userId: number) {
  await ensureDbInitialized();
  return db
    .select({
      targetType: bookmarks.targetType,
      targetId: bookmarks.targetId,
      createdAt: bookmarks.createdAt,
    })
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(bookmarks.createdAt));
}

export async function hasLiked(userId: number, targetType: string, targetId: number) {
  await ensureDbInitialized();
  const found = await db
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
  return found.length > 0;
}

export async function hasBookmarked(userId: number, targetType: string, targetId: number) {
  await ensureDbInitialized();
  const found = await db
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
  return found.length > 0;
}

export async function isFollowing(userId: number, targetType: string, targetId: number) {
  await ensureDbInitialized();
  const found = await db
    .select({ id: follows.id })
    .from(follows)
    .where(
      and(
        eq(follows.userId, userId),
        eq(follows.targetType, targetType),
        eq(follows.targetId, targetId),
      ),
    )
    .limit(1);
  return found.length > 0;
}

/* ------------------------------ Search ---------------------------- */
export async function searchAll(query: string) {
  await ensureDbInitialized();
  const q = `%${query.trim()}%`;
  const [news, community, collegeRows, userRows] = await Promise.all([
    db.query.newsArticles.findMany({
      where: or(ilike(newsArticles.title, q), ilike(newsArticles.summary, q)),
      with: { category: true },
      orderBy: [desc(newsArticles.publishedAt)],
      limit: 6,
    }),
    db.query.communityPosts.findMany({
      where: and(
        eq(communityPosts.status, "published"),
        or(ilike(communityPosts.title, q), ilike(communityPosts.description, q)),
      ),
      with: { author: true, category: true, college: true },
      orderBy: communityOrder("trending"),
      limit: 6,
    }),
    db.query.colleges.findMany({
      where: or(
        ilike(colleges.name, q),
        ilike(colleges.city, q),
        ilike(colleges.state, q),
      ),
      orderBy: [colleges.name],
      limit: 6,
    }),
    db.query.users.findMany({
      where: or(ilike(users.name, q), ilike(users.username, q)),
      orderBy: [users.name],
      limit: 6,
    }),
  ]);

  return { news, community, colleges: collegeRows, users: userRows };
}

/* ------------------------------ Profile --------------------------- */
export async function getUserPosts(userId: number) {
  await ensureDbInitialized();
  return db.query.communityPosts.findMany({
    where: eq(communityPosts.authorId, userId),
    with: { author: true, category: true, college: true },
    orderBy: [desc(communityPosts.createdAt)],
  });
}

export async function getUserFollowing(userId: number) {
  await ensureDbInitialized();
  const rows = await db.query.follows.findMany({
    where: eq(follows.userId, userId),
    orderBy: [desc(follows.createdAt)],
  });

  const collegeIds = rows.filter((r: any) => r.targetType === "college").map((r: any) => r.targetId);
  const userIds = rows.filter((r: any) => r.targetType === "user").map((r: any) => r.targetId);

  const [collegeRows, userRows] = await Promise.all([
    collegeIds.length ? db.query.colleges.findMany({ where: inArray(colleges.id, collegeIds) }) : Promise.resolve([]),
    userIds.length ? db.query.users.findMany({ where: inArray(users.id, userIds) }) : Promise.resolve([]),
  ]);

  return { colleges: collegeRows, users: userRows };
}

export async function getUserNotifications(userId: number) {
  await ensureDbInitialized();
  return db.query.notifications.findMany({
    where: eq(notifications.userId, userId),
    orderBy: [desc(notifications.createdAt)],
  });
}

export async function resolveBookmarks(userId: number) {
  await ensureDbInitialized();
  const rows = await getUserBookmarks(userId);
  const communityIds = rows
    .filter((r: any) => r.targetType === "community")
    .map((r: any) => r.targetId);
  const newsIds = rows.filter((r: any) => r.targetType === "news").map((r: any) => r.targetId);

  const [community, news] = await Promise.all([
    communityIds.length
      ? db.query.communityPosts.findMany({
          where: inArray(communityPosts.id, communityIds),
          with: { author: true, category: true, college: true },
        })
      : Promise.resolve([]),
    newsIds.length
      ? db.query.newsArticles.findMany({
          where: inArray(newsArticles.id, newsIds),
          with: { category: true },
        })
      : Promise.resolve([]),
  ]);

  return { community, news };
}

/* --------------------------- Filter options ----------------------- */
export async function getCommunityFilterOptions() {
  await ensureDbInitialized();
  const [statesResult, citiesResult] = await Promise.all([
    db
      .selectDistinct({ state: communityPosts.state })
      .from(communityPosts)
      .where(and(eq(communityPosts.status, "published"), isNotNull(communityPosts.state))),
    db
      .selectDistinct({ city: communityPosts.city })
      .from(communityPosts)
      .where(and(eq(communityPosts.status, "published"), isNotNull(communityPosts.city))),
  ]);

  return {
    states: statesResult.map((r: any) => r.state).filter((s: any): s is string => Boolean(s)).sort(),
    cities: citiesResult.map((r: any) => r.city).filter((s: any): s is string => Boolean(s)).sort(),
    colleges: await getColleges(),
    categories: await getCommunityCategories(),
  };
}
