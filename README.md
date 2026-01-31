# event-invitation-microsite

A responsive, single-page HTML invitation with a “two-page book” layout, curtain transition, confetti, a ticket “scanner” modal, and configurable links.

## Features

- Two-page layout (desktop) and single-page paging (mobile)
- Curtain transition between pages
- Confetti canvas effect
- Ticket scan modal with “used” state stored in `localStorage`
- Clickable venue that opens Google Maps
- Gift box opens a configurable registry link
- Optional dress-code chat link (Telegram/WhatsApp/Discord)
<img width="1234" height="889" alt="{3244555B-6E39-436A-AB34-CE02786273DB}" src="https://github.com/user-attachments/assets/3dd41589-e03e-4371-ba62-642328f008cc" />

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
<img width="1265" height="771" alt="{C8B5C81B-1037-4A69-A713-3DF1C1FA32A9}" src="https://github.com/user-attachments/assets/3a117df6-b5a7-47c5-aae2-4137a5e6b290" />


- <img width="940" height="765" alt="{9E718389-98CF-42EF-B2CF-0795E07E03D9}" src="https://github.com/user-attachments/assets/f9da665f-1141-408e-b8f7-3223b546ae22" />

