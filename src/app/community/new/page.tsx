import type { Metadata } from "next";
import Link from "next/link";
import { CreatePostForm } from "@/components/create-post-form";
import { ChevronRightIcon } from "@/components/icons";
import { INDIAN_STATES } from "@/lib/constants";
import { getColleges, getCommunityCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Share your story",
};

export default async function NewCommunityPostPage() {
  const [categories, colleges] = await Promise.all([
    getCommunityCategories(),
    getColleges(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <nav className="mx-auto flex max-w-2xl items-center gap-1 text-xs font-medium text-ink-faint">
        <Link href="/community" className="transition-colors hover:text-ink">
          Community
        </Link>
        <ChevronRightIcon className="h-3 w-3" />
        <span>Share your story</span>
      </nav>

      <header className="mx-auto mt-3 max-w-2xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Share your story
        </h1>
        <p className="mt-2 text-ink-soft">
          Tell your community what is happening around you.
        </p>
      </header>

      <div className="mt-8">
        <CreatePostForm
          categories={categories}
          colleges={colleges}
          states={[...INDIAN_STATES]}
        />
      </div>
    </div>
  );
}
