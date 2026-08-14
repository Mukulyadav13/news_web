"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-2xl">
        !
      </div>
      <h1 className="mt-5 text-2xl font-bold text-ink">Something went wrong.</h1>
      <p className="mt-2 text-sm text-ink-soft">
        We couldn&apos;t load this page. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Try again
      </button>
    </div>
  );
}
