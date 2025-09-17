# NepalKamma — Web client

Next.js + TypeScript web client for NepalKamma — a local gig marketplace connecting talent and jobs.

## Quick overview

- Frontend: Next.js (App Router), React (Client + Server components), TypeScript, Tailwind CSS
- State: SWR (server canonical) + Zustand (app-wide store)
- Realtime: WebSockets (socket hooks) for chat and presence
- HTTP client: axios, custom `fetcher` for SWR

## Prerequisites

- Node.js (v18+ recommended)
- pnpm
- Backend server running (the frontend expects an API and socket server)


## Implementation 

- Authentication: `useAuth` hook (SWR) fetches `/auth/check-auth` and writes the user into the Zustand store. When you update user data on the server, call SWR `mutate()` for that key or call a `fetchUser()` in the store to keep UI in sync.
- Document verification: After upload, backend should return the updated user object, or the frontend should revalidate the user. Otherwise the UI will show stale data until a reload.
- Offline & server detection: Prefer using SWR to detect server health (`/health`) rather than manual intervals. SWR avoids memory leaks and deduplicates requests.
- reCAPTCHA: The widget challenge popup is controlled by Google. For mobile, use the `compact` size or consider Invisible reCAPTCHA / v3 to avoid puzzle popups.

