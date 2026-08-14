"use client";

import { useState } from "react";
import { ImageIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  eager = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error",
  );

  return (
    <div className={cn("relative overflow-hidden bg-pill", className)}>
      {status !== "error" && src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            status === "loading" ? "opacity-0" : "opacity-100",
            imgClassName,
          )}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted-2 text-ink-faint">
          <ImageIcon className="h-8 w-8" />
        </div>
      )}
      {status === "loading" && <div className="skeleton absolute inset-0" />}
    </div>
  );
}
