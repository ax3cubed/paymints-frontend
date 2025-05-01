"use client";

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Address } from "@solana/kit";


export const isLoadingAtom = atom<boolean>(false);

// UI State Atoms
export const sidebarCollapsedAtom = atomWithStorage<boolean>("sidebarCollapsed", false);
export const currentThemeAtom = atomWithStorage<"light" | "dark" | "system">("currentTheme", "dark");

// Application State Atoms
export const balanceAtom = atom<number>(0);

export const notificationsAtom = atom<Array<{
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon?: React.ReactNode;
}>>([]);
