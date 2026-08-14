import { sql } from "drizzle-orm";
import { seedData } from "./seed";

export async function initSchemaAndSeed(db: any) {
  try {
    const statements = [
      sql`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        bio TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )`,
      sql`CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        scope TEXT NOT NULL,
        sort INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )`,
      sql`CREATE UNIQUE INDEX IF NOT EXISTS categories_scope_slug_uq ON categories (scope, slug)`,
      sql`CREATE TABLE IF NOT EXISTS colleges (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )`,
      sql`CREATE INDEX IF NOT EXISTS colleges_city_state_idx ON colleges (state, city)`,
      sql`CREATE TABLE IF NOT EXISTS news_articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        category_id INTEGER REFERENCES categories(id),
        scope TEXT NOT NULL,
        is_featured BOOLEAN NOT NULL DEFAULT FALSE,
        is_breaking BOOLEAN NOT NULL DEFAULT FALSE,
        views INTEGER NOT NULL DEFAULT 0,
        likes_count INTEGER NOT NULL DEFAULT 0,
        comments_count INTEGER NOT NULL DEFAULT 0,
        published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )`,
      sql`CREATE INDEX IF NOT EXISTS news_scope_published_idx ON news_articles (scope, published_at)`,
      sql`CREATE INDEX IF NOT EXISTS news_scope_featured_idx ON news_articles (scope, is_featured)`,
      sql`CREATE TABLE IF NOT EXISTS community_posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        content TEXT,
        images JSONB NOT NULL DEFAULT '[]'::jsonb,
        author_id INTEGER NOT NULL REFERENCES users(id),
        category_id INTEGER REFERENCES categories(id),
        college_id INTEGER REFERENCES colleges(id),
        state TEXT,
        city TEXT,
        local_area TEXT,
        status TEXT NOT NULL DEFAULT 'published',
        views INTEGER NOT NULL DEFAULT 0,
        likes_count INTEGER NOT NULL DEFAULT 0,
        comments_count INTEGER NOT NULL DEFAULT 0,
        bookmarks_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )`,
      sql`CREATE INDEX IF NOT EXISTS community_author_idx ON community_posts (author_id)`,
      sql`CREATE INDEX IF NOT EXISTS community_category_idx ON community_posts (category_id)`,
      sql`CREATE INDEX IF NOT EXISTS community_college_idx ON community_posts (college_id)`,
      sql`CREATE INDEX IF NOT EXISTS community_state_city_idx ON community_posts (state, city)`,
      sql`ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS local_area TEXT`,
      sql`ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS bookmarks_count INTEGER NOT NULL DEFAULT 0`,
      sql`CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        target_type TEXT NOT NULL,
        target_id INTEGER NOT NULL,
        author_id INTEGER NOT NULL REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )`,
      sql`CREATE INDEX IF NOT EXISTS comments_target_idx ON comments (target_type, target_id)`,
      sql`CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        target_type TEXT NOT NULL,
        target_id INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )`,
      sql`CREATE UNIQUE INDEX IF NOT EXISTS likes_user_target_uq ON likes (user_id, target_type, target_id)`,
      sql`CREATE TABLE IF NOT EXISTS bookmarks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        target_type TEXT NOT NULL,
        target_id INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )`,
      sql`CREATE UNIQUE INDEX IF NOT EXISTS bookmarks_user_target_uq ON bookmarks (user_id, target_type, target_id)`,
      sql`CREATE TABLE IF NOT EXISTS follows (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        target_type TEXT NOT NULL,
        target_id INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )`,
      sql`CREATE UNIQUE INDEX IF NOT EXISTS follows_user_target_uq ON follows (user_id, target_type, target_id)`,
      sql`CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )`,
    ];

    for (const stmt of statements) {
      await db.execute(stmt);
    }

    // 2. Check if users exist. If not, seed data.
    const result = await db.execute(sql`SELECT count(*)::int as count FROM users`);
    const count = result?.rows?.[0]?.count ?? result?.[0]?.count ?? 0;

    if (Number(count) === 0) {
      await seedData(db);
    }
  } catch (err) {
    console.error("Database schema init error:", err);
  }
}
