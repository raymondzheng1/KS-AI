"use client";

import { useState, type FC } from "react";
import { MediaLightbox } from "@/components/MediaLightbox";
import { AiFamilyTree, MlLoop, PromptAnatomy } from "./figures-a";
import { BiasTypes, CnnArchitecture, Diffusion } from "./figures-b";
import { ClaudeCodeLoop, CourseMindMap, DesignThinking } from "./figures-c";

/** Map each diagram filename stem → its themed SVG component. */
const REGISTRY: Record<string, FC> = {
  "01_ai_family_tree": AiFamilyTree,
  "02_ml_training_loop": MlLoop,
  "03_prompt_anatomy": PromptAnatomy,
  "04_cnn_architecture": CnnArchitecture,
  "05_bias_types": BiasTypes,
  "06_generative_ai_diffusion": Diffusion,
  "07_design_thinking": DesignThinking,
  "08_course_mind_map": CourseMindMap,
  "09_claude_code_loop": ClaudeCodeLoop,
};

function stemFromSrc(src: string): string {
  return src.replace(/^.*\//, "").replace(/\.[a-z0-9]+$/i, "");
}

/** Render the themed SVG diagram for a content `diagram.src`. Tappable to view
 *  full-screen (the diagrams are wide/landscape and small on a phone). Falls
 *  back to the committed raster if no SVG is registered for that stem. */
export function DiagramFigure({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const Cmp = REGISTRY[stemFromSrc(src)];
  const [open, setOpen] = useState(false);

  if (!Cmp) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} />
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge diagram: ${alt}`}
        className={`block w-full transition hover:opacity-90 ${className ?? ""}`}
      >
        <Cmp />
        <span className="mt-1 block text-center text-xs font-semibold text-ks-slate">
          🔍 Tap to enlarge
        </span>
      </button>
      <MediaLightbox open={open} onClose={() => setOpen(false)} label={alt}>
        <div className="max-h-[82vh] overflow-auto rounded-2xl bg-white p-3">
          {/* min-width so dense diagrams stay readable on a phone (swipe to pan) */}
          <div style={{ width: "max(100%, 720px)" }}>
            <Cmp />
          </div>
        </div>
      </MediaLightbox>
    </>
  );
}
