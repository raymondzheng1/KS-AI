import type { FC } from "react";
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

/** Render the themed SVG diagram for a content `diagram.src`. Falls back to the
 *  committed raster (public/diagrams) if no SVG is registered for that stem. */
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
  if (!Cmp) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} />
    );
  }
  return (
    <div className={className}>
      <Cmp />
    </div>
  );
}
