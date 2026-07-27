"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getLinkByCode, recordClick } from "@/lib/storage";
import { ShortLink } from "@/lib/types";
import Link from "next/link";

export default function ShortRedirect() {
  const params = useParams();
  const code = params.code as string;
  const [link, setLink] = useState<ShortLink | null | undefined>(undefined);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);

  useEffect(() => {
    if (!code) return;
    const found = getLinkByCode(code);
    if (!found) {
      setLink(null);
      return;
    }
    if (found.expiresAt && new Date(found.expiresAt) < new Date()) {
      setLink(null);
      return;
    }
    if (found.password) {
      setLink(found);
      setNeedsPassword(true);
      return;
    }
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const ref = typeof document !== "undefined" ? document.referrer : "";
    recordClick(code, ref, ua);
    window.location.href = found.originalUrl;
  }, [code]);

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!link) return;
    if (password === link.password) {
      const ua = navigator.userAgent;
      const ref = document.referrer;
      recordClick(code, ref, ua);
      window.location.href = link.originalUrl;
    } else {
      setError("Incorrect password");
    }
  };

  if (link === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (link === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="glass rounded-2xl p-8 max-w-md text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">Link not found</h1>
          <p className="text-muted mb-6">
            This short link doesn't exist, has expired, or was created in a
            different browser (data is stored locally).
          </p>
          <Link
            href="/"
            className="inline-block bg-primary hover:bg-primary-hover text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
          >
            Create a new link
          </Link>
        </div>
      </div>
    );
  }

  if (needsPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔒</div>
            <h1 className="text-xl font-bold">Password protected</h1>
            <p className="text-muted text-sm mt-1">
              Enter the password to continue to the destination.
            </p>
          </div>
          <form onSubmit={handlePassword} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
            {error && <p className="text-danger text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
