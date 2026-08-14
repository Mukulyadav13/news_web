import type { InferSelectModel } from "drizzle-orm";
import type * as schema from "@/db/schema";

export type User = InferSelectModel<typeof schema.users>;
export type Category = InferSelectModel<typeof schema.categories>;
export type College = InferSelectModel<typeof schema.colleges>;
export type NewsArticle = InferSelectModel<typeof schema.newsArticles>;
export type CommunityPost = InferSelectModel<typeof schema.communityPosts>;

export type NewsArticleWithCategory = NewsArticle & { category: Category | null };
export type CommunityPostWithRelations = CommunityPost & {
  author: User;
  category: Category | null;
  college: College | null;
};
