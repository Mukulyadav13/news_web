export const SITE_NAME = "Samachar";

export const SITE_TAGLINE = "News that matters. Stories from people.";

/** The demo "logged-in" user for this sandbox — set during seeding. */
export const DEMO_USER_ID = 1;

/** Static display info for the header/profile chrome (kept out of the DB path). */
export const DEMO_USER = { name: "Aarav Sharma", username: "aarav" };

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export const NEWS_SCOPES = ["national", "international"] as const;
export type NewsScope = (typeof NEWS_SCOPES)[number];

export const COMMUNITY_SORTS = [
  { key: "latest", label: "Latest" },
  { key: "trending", label: "Trending" },
  { key: "most-viewed", label: "Most Viewed" },
  { key: "most-liked", label: "Most Liked" },
  { key: "most-commented", label: "Most Commented" },
] as const;

export type CommunitySort = (typeof COMMUNITY_SORTS)[number]["key"];
