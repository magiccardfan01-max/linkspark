# ⚡ LinkSpark

**Modern URL shortener with analytics, QR codes, and a beautiful dark UI.**

Inspired by popular side-project idea lists on X/Twitter — a polished take on the classic URL shortener with real click tracking, device/browser insights, password protection, and expiring links.

## Features

- 🔗 **Create short links** with optional custom slugs
- 📊 **Click analytics** — count, device (mobile/desktop), browser, referrer, timestamps
- 📱 **QR codes** for every link (via free QR API)
- 🔒 **Password protection** for private links
- ⏳ **Expiring links** (set days until expiry)
- 🎨 **Beautiful dark UI** with glassmorphism and gradients
- 💾 **Local-first** — all data stored in your browser (localStorage). No account, no backend DB required.
- 📈 **Dashboard** with overview stats and per-link detail

## Tech Stack

- **Next.js 16** (App Router)
- **React 19** + TypeScript
- **Tailwind CSS v4**
- Pure client-side storage (localStorage)

> **Note:** Because links live in the browser’s localStorage, short links only work for the person who created them (or anyone using the same browser profile). This makes LinkSpark perfect as a personal tool / portfolio demo. For multi-user production use, plug in a database (Prisma + Postgres, Supabase, etc.).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Deploy instantly on Vercel:

```bash
npx vercel
```

Or push to GitHub and import the repo in the Vercel dashboard.

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Home – create links
│   ├── dashboard/        # Analytics dashboard
│   └── s/[code]/         # Redirect + password gate
├── lib/
│   ├── storage.ts        # localStorage CRUD + click tracking
│   ├── types.ts
│   └── utils.ts
└── ...
```

## License

MIT

---

Built as a cool side project idea found on Twitter 🚀
