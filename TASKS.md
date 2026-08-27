# Task Breakdown — Dental Clinic Website
For use as an agent task list in Google Antigravity. Each phase can be run as a separate agent task; verify with the browser-in-the-loop before moving to the next phase.

## Phase 0 — Project Setup
- [ ] Init Vite + React + Tailwind project
- [ ] Set up Supabase project; run `schema.sql`
- [ ] Add environment variables (Supabase URL + anon key) via `.env`
- [ ] Connect repo to Vercel; confirm preview deploy works
- [ ] Configure custom domain DNS once purchased

## Phase 1 — Static Homepage (placeholder content)
- [ ] Build sticky header with hamburger menu (Home / Services / Before & After / Contact) + Call/Directions buttons
- [ ] Build hero section with headline, tagline, organic shape accents, "Book Appointment" CTA
- [ ] Build Services section (card grid, placeholder services from PRD Section 5)
- [ ] Build Before & After swipeable slider (placeholder images)
- [ ] Build Google Reviews auto-rotating carousel (placeholder reviews)
- [ ] Build Footer (address, map embed placeholder, phone, socials)
- [ ] Build sticky bottom nav (mobile): Call | Book | Contact
- [ ] Verify responsive breakpoints: 375px / 768px / 1280px

## Phase 2 — Booking System
- [ ] Build patient booking form (date strip → slot picker → name/phone → confirm)
- [ ] Connect booking form to Supabase `bookings` table (insert)
- [ ] Handle race condition: re-check slot availability before insert; show error if taken
- [ ] Build admin login (password gate for v1)
- [ ] Build admin week-calendar view reading from Supabase
- [ ] Build slot modal: edit / cancel / add walk-in booking (update/delete/insert against Supabase)
- [ ] Add loading and error states throughout

## Phase 3 — Real Content Integration
- [ ] Swap placeholder services with real list from client
- [ ] Swap placeholder before/after images with real (consented) photos
- [ ] Swap placeholder reviews with real Google reviews
- [ ] Add real logo (or finalize text-based logo)
- [ ] Confirm final color palette / typography with client

## Phase 4 — SEO & Launch
- [ ] Add meta titles/descriptions per section
- [ ] Add `LocalBusiness` + `Dentist` JSON-LD schema markup with real NAP
- [ ] Add sitemap.xml + robots.txt
- [ ] Verify NAP consistency with Google Business Profile
- [ ] Run Lighthouse audit; fix anything below 90 on mobile
- [ ] Point custom domain to Vercel; verify SSL
- [ ] Final QA pass on real devices (Android + iOS)

## Phase 5 — Optional Enhancements
- [ ] SMS/WhatsApp booking confirmations (Twilio / MSG91 / WhatsApp Business API)
- [ ] Live Google Reviews sync via Places API
- [ ] Supabase Auth for multi-staff admin logins
- [ ] Analytics (privacy-friendly, e.g. Plausible or GA4)
