import { GridSkeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="skeleton h-8 w-40 rounded-lg" />
      <div className="skeleton mt-3 h-4 w-72 max-w-full rounded" />
      <div className="mt-8">
        <GridSkeleton type="news" />
      </div>
    </div>
  );
}
