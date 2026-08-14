import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  bio: text("bio"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Categories — database-driven, scoped to national / international /  */
/* community so admins can add or edit them later.                     */
/* ------------------------------------------------------------------ */
export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    scope: text("scope").notNull(), // "national" | "international" | "community"
    sort: integer("sort").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("categories_scope_slug_uq").on(t.scope, t.slug)],
);

/* ------------------------------------------------------------------ */
/* Colleges — reached only through Community & Search.                 */
/* ------------------------------------------------------------------ */
export const colleges = pgTable(
  "colleges",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    city: text("city").notNull(),
    state: text("state").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("colleges_city_state_idx").on(t.state, t.city)],
);

/* ------------------------------------------------------------------ */
/* Official news — uploaded by our team.                               */
/* ------------------------------------------------------------------ */
export const newsArticles = pgTable(
  "news_articles",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    summary: text("summary").notNull(),
    content: text("content").notNull(),
    imageUrl: text("image_url"),
    categoryId: integer("category_id").references(() => categories.id),
    scope: text("scope").notNull(), // "national" | "international"
    isFeatured: boolean("is_featured").notNull().default(false),
    isBreaking: boolean("is_breaking").notNull().default(false),
    views: integer("views").notNull().default(0),
    likesCount: integer("likes_count").notNull().default(0),
    commentsCount: integer("comments_count").notNull().default(0),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("news_scope_published_idx").on(t.scope, t.publishedAt),
    index("news_scope_featured_idx").on(t.scope, t.isFeatured),
  ],
);

/* ------------------------------------------------------------------ */
/* Community posts — stories uploaded by users.                        */
/* ------------------------------------------------------------------ */
export const communityPosts = pgTable(
  "community_posts",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    content: text("content"),
    images: jsonb("images").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    authorId: integer("author_id")
      .notNull()
      .references(() => users.id),
    categoryId: integer("category_id").references(() => categories.id),
    state: text("state"),
    city: text("city"),
    localArea: text("local_area"),
    collegeId: integer("college_id").references(() => colleges.id),
    status: text("status").notNull().default("published"), // published | pending
    views: integer("views").notNull().default(0),
    likesCount: integer("likes_count").notNull().default(0),
    commentsCount: integer("comments_count").notNull().default(0),
    bookmarksCount: integer("bookmarks_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("posts_created_idx").on(t.createdAt),
    index("posts_college_idx").on(t.collegeId),
    index("posts_author_idx").on(t.authorId),
    index("posts_state_city_idx").on(t.state, t.city),
  ],
);

/* ------------------------------------------------------------------ */
/* Engagement — likes, bookmarks, comments (polymorphic targets).      */
/* ------------------------------------------------------------------ */
export const likes = pgTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    targetType: text("target_type").notNull(), // "news" | "community"
    targetId: integer("target_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("likes_unique").on(t.userId, t.targetType, t.targetId)],
);

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    targetType: text("target_type").notNull(), // "news" | "community"
    targetId: integer("target_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("bookmarks_unique").on(t.userId, t.targetType, t.targetId)],
);

export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    targetType: text("target_type").notNull(), // "news" | "community"
    targetId: integer("target_id").notNull(),
    authorId: integer("author_id")
      .notNull()
      .references(() => users.id),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("comments_target_idx").on(t.targetType, t.targetId)],
);

/* ------------------------------------------------------------------ */
/* Follows — users can follow colleges and other users.                */
/* ------------------------------------------------------------------ */
export const follows = pgTable(
  "follows",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    targetType: text("target_type").notNull(), // "college" | "user"
    targetId: integer("target_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("follows_unique").on(t.userId, t.targetType, t.targetId)],
);

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    type: text("type").notNull(),
    message: text("message").notNull(),
    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("notifications_user_idx").on(t.userId)],
);

/* ------------------------------------------------------------------ */
/* Relations                                                           */
/* ------------------------------------------------------------------ */
export const categoriesRelations = relations(categories, ({ many }) => ({
  news: many(newsArticles),
  posts: many(communityPosts),
}));

export const newsArticlesRelations = relations(newsArticles, ({ one }) => ({
  category: one(categories, {
    fields: [newsArticles.categoryId],
    references: [categories.id],
  }),
}));

export const communityPostsRelations = relations(communityPosts, ({ one }) => ({
  author: one(users, { fields: [communityPosts.authorId], references: [users.id] }),
  category: one(categories, {
    fields: [communityPosts.categoryId],
    references: [categories.id],
  }),
  college: one(colleges, {
    fields: [communityPosts.collegeId],
    references: [colleges.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
}));
