import { ShortLink, ClickEvent, AppState } from "./types";
import { generateShortCode, parseUserAgent } from "./utils";

const STORAGE_KEY = "linkspark_data_v1";

export function loadState(): AppState {
  if (typeof window === "undefined") return { links: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { links: [] };
    return JSON.parse(raw) as AppState;
  } catch {
    return { links: [] };
  }
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function createLink(
  originalUrl: string,
  options: { title?: string; customCode?: string; password?: string; expiresInDays?: number } = {}
): ShortLink {
  const state = loadState();
  let shortCode = options.customCode?.trim() || generateShortCode();
  // ensure unique
  while (state.links.some((l) => l.shortCode === shortCode)) {
    shortCode = generateShortCode();
  }
  const now = new Date();
  const link: ShortLink = {
    id: generateShortCode(12),
    shortCode,
    originalUrl,
    title: options.title || undefined,
    createdAt: now.toISOString(),
    clicks: 0,
    clickEvents: [],
    password: options.password || undefined,
    expiresAt: options.expiresInDays
      ? new Date(now.getTime() + options.expiresInDays * 86400000).toISOString()
      : undefined,
  };
  state.links.unshift(link);
  saveState(state);
  return link;
}

export function getLinkByCode(code: string): ShortLink | undefined {
  const state = loadState();
  return state.links.find((l) => l.shortCode === code);
}

export function recordClick(code: string, referrer: string, userAgent: string): ShortLink | null {
  const state = loadState();
  const idx = state.links.findIndex((l) => l.shortCode === code);
  if (idx === -1) return null;
  const link = state.links[idx];
  if (link.expiresAt && new Date(link.expiresAt) < new Date()) return null;
  const { device, browser } = parseUserAgent(userAgent);
  const event: ClickEvent = {
    id: generateShortCode(10),
    timestamp: new Date().toISOString(),
    referrer: referrer || "Direct",
    userAgent,
    device,
    browser,
  };
  link.clicks += 1;
  link.clickEvents.unshift(event);
  // keep last 100 events
  if (link.clickEvents.length > 100) link.clickEvents = link.clickEvents.slice(0, 100);
  state.links[idx] = link;
  saveState(state);
  return link;
}

export function deleteLink(id: string) {
  const state = loadState();
  state.links = state.links.filter((l) => l.id !== id);
  saveState(state);
}

export function getAllLinks(): ShortLink[] {
  return loadState().links;
}
