export interface ClickEvent {
  id: string;
  timestamp: string;
  referrer: string;
  userAgent: string;
  device: string;
  browser: string;
}

export interface ShortLink {
  id: string;
  shortCode: string;
  originalUrl: string;
  title?: string;
  createdAt: string;
  clicks: number;
  clickEvents: ClickEvent[];
  password?: string;
  expiresAt?: string;
}

export interface AppState {
  links: ShortLink[];
}
