# BASSnBEATS — Your Sound. Your Vibe.

A premium, modern music streaming platform built for high-fidelity audio discovery, real-time synchronized timed lyrics, procedural synth streaming engine, offline listening, collaborative live jam sessions, and artist & administration dashboards.

---

## 1. Features

- **Sonic Discovery & Home**: Personalized time-of-day greetings, Daily Mixes, Made For You algorithms, Trending tracks, and New Releases.
- **Advanced Search Engine**: Real-time autocomplete, typo tolerance, advanced query filters (`genre:south-bass`, `artist:kavya`, `year:2026`), and visual genre exploration.
- **Audio Streaming & Synthesis Engine**: Procedural Web Audio synthesis for continuous layered playback (Synthwave, Deep Bass, Lo-Fi, Indian Classical/Folk Fusion) with live frequency spectrum analysis, 3-band parametric equalizer, and audio quality simulation (160kbps, 320kbps, and 24-bit 96kHz Lossless).
- **Synchronized Timed Lyrics**: Real-time lyric line tracking with smooth auto-scroll, active highlighting, timestamp seeking on click, and fullscreen view.
- **Queue Management**: Full queue inspection, track reordering, next-up scheduling, and "Save Queue as Playlist".
- **Playlist & Library Ecosystem**: Create, edit, collaborate, and share custom playlists. Liked songs library with 1-click play and shuffle.
- **Offline Mode & Downloads**: Authorized offline playback with encrypted local cache simulation and device storage meters.
- **Social Live Jam Rooms**: Real-time synchronized listening room with listener presence and live emoji reactions.
- **Artist Studio**: Upload interface for audio, cover art, BPM, explicit tags, and timed lyrics; release analytics and royalty estimation.
- **Super Admin Console**: Platform KPIs (DAU, MAU, MRR, Churn), user account permissions & status control, moderation queue for flagged content, catalog publishing, and immutable audit logs.
- **PWA & Mobile Responsive**: Installable progressive web app with sticky bottom player and bottom navigation bar.

---

## 2. Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Web Audio API, Canvas Confetti.
- **Backend**: Node.js / Express with RESTful routing (`/api/*`), streaming audio range requests, and WebSocket support.
- **Database Architecture**: PostgreSQL schema with Prisma ORM migrations and Redis caching layer.
- **Storage**: Object storage (S3 / Cloudflare R2 / Supabase Storage) with signed URLs.

---

## 3. Environment Variables

Create `.env` based on `.env.example`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/bassnbeats"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="bassnbeats_super_secure_jwt_secret_key"
JWT_REFRESH_SECRET="bassnbeats_super_secure_refresh_secret"

STORAGE_BUCKET="bassnbeats-media"
STORAGE_REGION="auto"
STORAGE_ACCESS_KEY="my_storage_access_key"
STORAGE_SECRET_KEY="my_storage_secret_key"

GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
STRIPE_SECRET_KEY="sk_test_..."
RAZORPAY_KEY_ID="rzp_test_..."

ADMIN_EMAIL="admin@bassnbeats.com"
ADMIN_PASSWORD="AdminBASSnBEATS2026!"
```

---

## 4. Local Development & Setup

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Build for production
npm run build
```

---

## 5. Default Demo Credentials

- **Super Admin**: `admin@bassnbeats.com` (Select 'Admin' role in top bar or login with any password)
- **Verified Artist**: `kavyarao_official` (Select 'Artist' role in top bar)
- **Standard Listener**: `basavaraj_beats` (Default listener account)

---

## 6. Architecture & Security Checklist

- **HTTPS & Secure Cookies**: HTTP-only secure cookie sessions with refresh token rotation.
- **Zero Mock Failures**: Built-in fallback Web Audio synthesis ensures continuous sound playback even when external CDNs are restricted.
- **Content Security Policy**: Audio Context is lazily initialized on user gesture to comply with browser autoplay policies.
- **Protected Offline Caching**: Stored in isolated IndexedDB/localStorage partitions.
