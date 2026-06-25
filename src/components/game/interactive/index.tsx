"use client";

import type { FC } from "react";
import { HumanSortingGame } from "./HumanSortingGame";
import { TeachableMachineRecorder } from "./TeachableMachineRecorder";

/** In-app interactive widgets, keyed by an activity's `interactive` id. */
const REGISTRY: Record<string, FC> = {
  "human-sorting": HumanSortingGame,
  "teachable-machine-recorder": TeachableMachineRecorder,
};

export function ActivityInteractive({ id }: { id: string }) {
  const Cmp = REGISTRY[id];
  return Cmp ? <Cmp /> : null;
}

export function hasInteractive(id?: string): boolean {
  return !!id && id in REGISTRY;
}
