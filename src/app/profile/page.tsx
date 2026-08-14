import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { CommunityCard } from "@/components/community-card";
import {
  BellIcon,
  BookmarkIcon,
  BuildingIcon,
  ClockIcon,
  FileTextIcon,
  HeartIcon,
  MessageIcon,
  MoonIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "@/components/icons";
import { NewsCard } from "@/components/news-card";
import { MarkAllReadButton, SettingsForm } from "@/components/profile-actions";
import { ThemeSwitch } from "@/components/theme-switch";
import { EmptyState } from "@/components/ui";
import { DEMO_USER_ID } from "@/lib/constants";
import {
  getCurrentUser,
  getUserFollowing,
  getUserNotifications,
  getUserPosts,
  resolveBookmarks,
} from "@/lib/queries";
import { cn, formatDate, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profile",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const TABS = [
  { key: "profile", label: "My Profile" },
  { key: "posts", label: "My Posts" },
  { key: "bookmarks", label: "Bookmarks" },
  { key: "following", label: "Following" },
  { key: "notifications", label: "Notifications" },
  { key: "settings", label: "Settings" },
];

export default async function ProfilePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const tabParam = typeof sp.tab === "string" ? sp.tab : "profile";
  const tab = TABS.some((t) => t.key === tabParam) ? tabParam : "profile";

  const user = await getCurrentUser();

  const [posts, following, notifications, bookmarks] = await Promise.all([
    user ? getUserPosts(user.id) : Promise.resolve([]),
    user ? getUserFollowing(user.id) : Promise.resolve({ colleges: [], users: [] }),
    user ? getUserNotifications(user.id) : Promise.resolve([]),
    user ? resolveBookmarks(user.id) : Promise.resolve({ community: [], news: [] }),
  ]);

  const followingCount = following.colleges.length + following.users.length;
  const savedCount = bookmarks.community.length + bookmarks.news.length;
  const hasUnread = notifications.some((n: any) => !n.read);

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <EmptyState
          icon={<UserIcon className="h-10 w-10" />}
          title="No profile found"
          description="Something went wrong while loading your profile."
        />
      </div>
    );
  }

  const tabHref = (key: string) => (key === "profile" ? "/profile" : `/profile?tab=${key}`);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Header */}
      <header className="overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-line">
        <div className="h-28 bg-gradient-to-r from-brand via-brand-dark to-community" />
        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span className="rounded-full ring-4 ring-surface">
                <Avatar name={user.name} size="xl" />
              </span>
              <div className="pb-0.5">
                <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-ink">
                  {user.name}
                </h1>
                <p className="text-sm text-ink-faint">@{user.username}</p>
              </div>
            </div>
            <div className="flex gap-2 self-start sm:self-auto">
              <Link
                href="/community/new"
                className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                <PlusIcon className="h-4 w-4" />
                Share your story
              </Link>
              <Link
                href="/profile?tab=settings"
                className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-muted"
              >
                <SettingsIcon className="h-4 w-4" />
                Edit profile
              </Link>
            </div>
          </div>

          {user.bio ? (
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-soft">{user.bio}</p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Stat value={posts.length} label="Posts" />
            <Stat value={followingCount} label="Following" />
            <Stat value={savedCount} label="Saved" />
            <span className="hidden items-center gap-1.5 text-ink-faint sm:inline-flex">
              <ClockIcon className="h-4 w-4" />
              Joined {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="no-scrollbar mt-6 flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((item) => (
          <a
            key={item.key}
            href={tabHref(item.key)}
            className={cn(
              "-mb-px shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors duration-200",
              tab === item.key
                ? "border-brand text-ink"
                : "border-transparent text-ink-soft hover:text-ink",
            )}
          >
            {item.label}
            {item.key === "notifications" && hasUnread ? (
              <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-brand" />
            ) : null}
          </a>
        ))}
      </div>

      {/* Content */}
      <div className="mt-7">
        {tab === "profile" && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-line">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <UserIcon className="h-5 w-5 text-ink-faint" />
                About
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between border-b border-line pb-3">
                  <dt className="text-ink-faint">Display name</dt>
                  <dd className="font-medium text-ink">{user.name}</dd>
                </div>
                <div className="flex justify-between border-b border-line pb-3">
                  <dt className="text-ink-faint">Username</dt>
                  <dd className="font-medium text-ink">@{user.username}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-faint">Joined</dt>
                  <dd className="font-medium text-ink">{formatDate(user.createdAt)}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-line">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <SettingsIcon className="h-5 w-5 text-ink-faint" />
                Quick actions
              </h2>
              <div className="mt-4 flex flex-col gap-2">
                <QuickLink href="/community/new" icon={<PlusIcon className="h-4 w-4" />}>
                  Share a story
                </QuickLink>
                <QuickLink href="/profile?tab=bookmarks" icon={<BookmarkIcon className="h-4 w-4" />}>
                  View bookmarks
                </QuickLink>
                <QuickLink href="/profile?tab=settings" icon={<SettingsIcon className="h-4 w-4" />}>
                  Edit profile
                </QuickLink>
              </div>
            </div>
          </div>
        )}

        {tab === "posts" && (
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
              <FileTextIcon className="h-5 w-5 text-ink-faint" />
              My Posts
            </h2>
            {posts.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  icon={<FileTextIcon className="h-10 w-10" />}
                  title="You haven't shared a story yet"
                  description="Stories you share from Community will appear here."
                  action={
                    <Link
                      href="/community/new"
                      className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                    >
                      Share your story
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post: any) => (
                  <CommunityCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "bookmarks" && (
          <div className="space-y-10">
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <BookmarkIcon className="h-5 w-5 text-ink-faint" />
                Saved stories
              </h2>
              {bookmarks.community.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    icon={<BookmarkIcon className="h-10 w-10" />}
                    title="Save stories to find them here later"
                    description="Tap the bookmark icon on any story to save it."
                  />
                </div>
              ) : (
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {bookmarks.community.map((post: any) => (
                    <CommunityCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </section>

            {bookmarks.news.length > 0 ? (
              <section>
                <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                  <BookmarkIcon className="h-5 w-5 text-ink-faint" />
                  Saved news
                </h2>
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {bookmarks.news.map((article: any) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}

        {tab === "following" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <BuildingIcon className="h-5 w-5 text-community" />
                Colleges
              </h2>
              {following.colleges.length === 0 ? (
                <p className="mt-4 rounded-xl bg-muted px-4 py-6 text-center text-sm text-ink-soft">
                  You are not following any colleges yet.
                </p>
              ) : (
                <div className="mt-4 space-y-2">
                  {following.colleges.map((college: any) => (
                    <Link
                      key={college.id}
                      href={`/colleges/${college.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 transition-all duration-200 hover:border-line-strong hover:shadow-sm"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-community-soft text-community">
                        <BuildingIcon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-ink">
                          {college.name}
                        </span>
                        <span className="block text-sm text-ink-faint">
                          {college.city}, {college.state}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <UsersIcon className="h-5 w-5 text-ink-faint" />
                People
              </h2>
              {following.users.length === 0 ? (
                <p className="mt-4 rounded-xl bg-muted px-4 py-6 text-center text-sm text-ink-soft">
                  You are not following anyone yet.
                </p>
              ) : (
                <div className="mt-4 space-y-2">
                  {following.users.map((followed: any) => (
                    <div
                      key={followed.id}
                      className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4"
                    >
                      <Avatar name={followed.name} size="md" />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-ink">
                          {followed.name}
                        </span>
                        <span className="block truncate text-sm text-ink-faint">
                          @{followed.username}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {tab === "notifications" && (
          <div>
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <BellIcon className="h-5 w-5 text-ink-faint" />
                Notifications
              </h2>
              <MarkAllReadButton hasUnread={hasUnread} />
            </div>
            {notifications.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  icon={<BellIcon className="h-10 w-10" />}
                  title="You're all caught up"
                  description="Likes, comments and updates will show up here."
                />
              </div>
            ) : (
              <ul className="mt-4 space-y-2">
                {notifications.map((notification: any) => (
                  <li
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-4 transition-colors",
                      notification.read
                        ? "border-line bg-surface"
                        : "border-brand/10 bg-brand-soft/30",
                    )}
                  >
                    <NotificationIcon type={notification.type} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink">{notification.message}</p>
                      <p className="mt-0.5 text-xs text-ink-faint">
                        {timeAgo(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read ? (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "settings" && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-line">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <SettingsIcon className="h-5 w-5 text-ink-faint" />
                Profile details
              </h2>
              <div className="mt-5">
                <SettingsForm initialName={user.name} initialBio={user.bio ?? ""} />
              </div>
            </div>

            <div className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-line">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <MoonIcon className="h-5 w-5 text-ink-faint" />
                Appearance
              </h2>
              <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-line p-4">
                <div>
                  <p className="text-sm font-semibold text-ink">Dark mode</p>
                  <p className="mt-0.5 text-sm text-ink-faint">
                    Switch between a light and dark theme.
                  </p>
                </div>
                <ThemeSwitch />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-base font-bold text-ink">{value}</span>
      <span className="text-ink-faint">{label}</span>
    </span>
  );
}

function QuickLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-xl border border-line px-4 py-3 text-sm font-medium text-ink-soft transition-colors hover:border-line-strong hover:bg-muted hover:text-ink"
    >
      <span className="text-ink-faint">{icon}</span>
      {children}
    </Link>
  );
}

function NotificationIcon({ type }: { type: string }) {
  const map: Record<string, React.ReactNode> = {
    like: (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand">
        <HeartIcon className="h-4 w-4" />
      </span>
    ),
    comment: (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted-2 text-ink-soft">
        <MessageIcon className="h-4 w-4" />
      </span>
    ),
    follow: (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-community-soft text-community-ink">
        <UsersIcon className="h-4 w-4" />
      </span>
    ),
    system: (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pill text-ink-soft">
        <BellIcon className="h-4 w-4" />
      </span>
    ),
  };
  return <span className="shrink-0">{map[type] ?? map.system}</span>;
}
