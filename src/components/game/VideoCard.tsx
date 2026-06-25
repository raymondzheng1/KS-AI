"use client";

import { useState } from "react";
import type { Video } from "@/lib/content/schema";

/**
 * Curated lesson video. Click-to-load only — the youtube-nocookie iframe is not
 * mounted until the kid presses play (no third-party calls, no autoplay; §6 /
 * child-safety). A × button closes it (YouTube's iframe swallows Escape).
 */
export function VideoCard({ video }: { video: Video }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="ks-card overflow-hidden">
      {open ? (
        <div className="relative aspect-video w-full bg-black">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close video"
            className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-lg font-bold text-white"
          >
            ✕
          </button>
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="group relative block aspect-video w-full"
          aria-label={`Play ${video.title}`}
        >
          {/* YouTube thumbnail — external, click-to-load; not worth next/image
              optimization (img-src allow-lists i.ytimg.com). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
            alt=""
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/35">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ks-coral text-2xl text-white shadow-card">
              ▶
            </span>
          </span>
        </button>
      )}
      <div className="p-3">
        <p className="font-bold text-ks-dark">{video.title}</p>
        <p className="text-xs text-ks-ink-soft">
          {video.source}
          {video.minutes ? ` · ${video.minutes} min` : ""}
        </p>
        {video.note && <p className="mt-1 text-sm text-ks-ink">{video.note}</p>}
      </div>
    </div>
  );
}
