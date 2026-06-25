"use client";

import { useState } from "react";
import { MediaLightbox } from "@/components/MediaLightbox";
import type { Video } from "@/lib/content/schema";

/**
 * Curated lesson video. The thumbnail is click-to-load only — the
 * youtube-nocookie player is mounted (inside a full-screen lightbox) ONLY when
 * the kid taps play, so there are no third-party calls / autoplay until then
 * (§6 / child-safety). On a phone the player fills the screen width.
 */
export function VideoCard({ video }: { video: Video }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="ks-card overflow-hidden">
      <button
        onClick={() => setOpen(true)}
        className="group relative block aspect-video w-full"
        aria-label={`Play ${video.title}`}
      >
        {/* YouTube thumbnail — external, click-to-load (img-src allow-lists i.ytimg.com). */}
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
      <div className="p-3">
        <p className="font-bold text-ks-dark">{video.title}</p>
        <p className="text-xs text-ks-ink-soft">
          {video.source}
          {video.minutes ? ` · ${video.minutes} min` : ""}
        </p>
        {video.note && <p className="mt-1 text-sm text-ks-ink">{video.note}</p>}
      </div>

      <MediaLightbox open={open} onClose={() => setOpen(false)} label={video.title}>
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="mt-2 text-center text-sm text-white/80">
          {video.title} · {video.source}
        </p>
      </MediaLightbox>
    </div>
  );
}
