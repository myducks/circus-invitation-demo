# Circus Invitation — Interactive Demo

A responsive, single-page HTML invitation with a “two-page book” layout, curtain transition, confetti, a ticket “scanner” modal, and configurable links.

## Features

- Two-page layout (desktop) and single-page paging (mobile)
- Curtain transition between pages
- Confetti canvas effect
- Ticket scan modal with “used” state stored in `localStorage`
- Clickable venue that opens Google Maps
- Gift box opens a configurable registry link
- Optional dress-code chat link (Telegram/WhatsApp/Discord)

## Quick start

### Option A — open directly
Open `index.html` in a browser (best results via a local server).

### Option B — run a local dev server (recommended)
1. Install Node.js (LTS).
2. In the project folder:
   - `npm install`
   - `npm run dev`

## Customize content

Edit `js/config.js`:

- `EVENT_TITLE`, `EVENT_DATE`, `EVENT_TIME`, `EVENT_VENUE`, `EVENT_RSVP`
- `GIFT_URL`
- `DRESSCODE_CHAT_URL` (leave empty to disable)

## Deploy

### GitHub Pages (simple)
1. Push this repository to GitHub.
2. Enable **Settings → Pages** and select the `main` branch, root folder.
3. Open the published URL.

## Notes

- All sample data is neutral/placeholders.
- Images in `assets/` are placeholders and can be replaced with your artwork (keep the same filenames).
- Google Fonts are loaded from `fonts.googleapis.com`.
