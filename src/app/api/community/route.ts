import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db, ensureDbInitialized } from "@/db";
import { communityPosts } from "@/db/schema";
import { DEMO_USER_ID } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await ensureDbInitialized();
    const body = (await request.json()) as {
      title?: string;
      description?: string;
      content?: string;
      state?: string;
      city?: string;
      localArea?: string;
      categoryId?: number | null;
      collegeId?: number | null;
      images?: string[];
    };

    const title = (body.title ?? "").trim();
    if (!title) {
      return NextResponse.json({ error: "Please add a title." }, { status: 400 });
    }
    if (title.length > 200) {
      return NextResponse.json({ error: "Title is too long." }, { status: 400 });
    }

    const images = Array.isArray(body.images)
      ? body.images.filter((img) => typeof img === "string" && img.length > 0).slice(0, 6)
      : [];

    const base = slugify(title).slice(0, 80) || "story";
    const slug = `${base}-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;

    await db.insert(communityPosts).values({
      title,
      slug,
      description: (body.description ?? "").trim(),
      content: (body.content ?? "").trim(),
      state: (body.state ?? "").trim() || null,
      city: (body.city ?? "").trim() || null,
      localArea: (body.localArea ?? "").trim() || null,
      categoryId: body.categoryId ?? null,
      collegeId: body.collegeId ?? null,
      images: JSON.stringify(images) as any,
      authorId: DEMO_USER_ID,
      status: "published",
    });

    revalidatePath("/community");
    revalidatePath("/profile");

    return NextResponse.json({ ok: true, slug });
  } catch (err: any) {
    console.error("Community POST error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
