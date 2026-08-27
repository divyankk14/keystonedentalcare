# Product Requirements Document
## Dental Clinic Website + Appointment Booking System

**Client:** Dr. Sayali Dethe (Dental Clinic)
**Prepared by:** Divyank Khobragade
**Status:** Draft — pending final client content (marked as `[TBD]` throughout)
**Target build environment:** Google Antigravity (agentic dev platform)

---

## 1. Summary

A mobile-first marketing website for a dental clinic with an integrated appointment booking system and a password-protected admin dashboard for the clinic to manage bookings. Primary goals: (1) convert visitors into booked appointments, (2) rank locally on Google for dentist-related searches, (3) give the clinic owner a simple way to view and manage her schedule without needing technical help.

---

## 2. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Drive appointment bookings | # of bookings/week via the site |
| Rank on local search | Ranking for "dentist in [city]" and 3–5 service-specific keywords within 60–90 days |
| Reduce admin overhead | Clinic can view/edit/cancel bookings without calling the developer |
| Fast, mobile-friendly experience | Lighthouse performance score 90+, mobile-first layout |

---

## 3. Users & Roles

1. **Patient (public visitor)** — browses services, views reviews/before-after, books an appointment. No login required.
2. **Admin (clinic staff/Dr. Dethe)** — logs into a protected dashboard to view a calendar of bookings, edit/cancel/reschedule, and add walk-in bookings manually.

---

## 4. Scope

### In scope (v1)
- Marketing homepage (single page, scrollable, mobile-first)
- Appointment booking flow (date + time slot + name + phone)
- Admin dashboard (calendar view, CRUD on bookings)
- Basic technical SEO (meta tags, schema.org LocalBusiness/Dentist markup, sitemap, fast load)
- Custom domain setup

### Out of scope (v1 — possible future phases)
- Online payments
- Patient accounts / login / appointment history for patients
- SMS/WhatsApp/email automated confirmations (flagged as Phase 2 — needs paid API)
- Multi-location support
- Multi-staff/multi-chair scheduling (v1 assumes single dentist / single chair)
- Blog/content section

---

## 5. Site Structure (single-page, scrollable, mobile-first)

Reference design direction: Grand Street Dental (clean, modern, shape-accented, mobile-first with sticky bottom nav) — approved by client.

1. **Sticky header**
   - Logo (left)
   - Hamburger menu (right) → full-screen overlay with: Home / Services (expandable) / Before & After / Contact, plus "Call Us" and "Directions" buttons pinned to the bottom of the menu
   - "Book" pill button always visible in header

2. **Hero section**
   - Headline + short tagline
   - Soft organic shape accents (brand colors, not stock photography)
   - Primary CTA: "Book Appointment" (scrolls to booking form)
   - Optional: review count / trust line (e.g. "4.9★ on Google, 120+ reviews") `[TBD — pending real review count]`

3. **Services section**
   - Card grid (1 column mobile, 2–3 columns desktop)
   - Each card: icon, service name, 1-line description, tappable/expandable for more detail
   - Service list: `[TBD — client to provide exact list]`. Placeholder set: General Checkup & Cleaning, Root Canal Treatment, Braces/Orthodontics, Dental Implants, Teeth Whitening, Tooth Extraction, Pediatric Dentistry, Dentures/Bridges

4. **Before & After**
   - Swipeable slider, 1 case per screen on mobile
   - Requires real patient photos with signed consent `[TBD]`. Placeholder imagery until provided.

5. **Google Reviews carousel**
   - Auto-rotating carousel: star rating, short review text, reviewer name
   - v1: hardcoded from 4–6 real reviews copied from her Google Business Profile `[TBD — client to supply or approve pulling from her listing]`
   - Phase 2 option: live-sync via Google Places API

6. **Contact + Book Appointment**
   - Clinic address, embedded Google Map, click-to-call phone number
   - Appointment booking form (see Section 6)

7. **Footer**
   - Address, phone, social links, quick nav links, business hours

8. **Sticky bottom nav (mobile only)**
   - 3 icons always visible: Call | Book | Contact

---

## 6. Booking System — Functional Requirements

### 6.1 Patient booking flow
1. Patient selects a date from a 7-day horizontal date strip
2. Available time slots for that date are shown as buttons; already-booked slots are visually disabled (grayed out, struck through)
3. Patient enters **name** and **10-digit phone number**
4. On submit: validate inputs → check slot is still free (handles race condition of two people booking simultaneously) → write booking to database → show on-screen confirmation
5. No login required for patients

### 6.2 Slot configuration `[TBD — confirm with client]`
- Slot length: 30 min or 60 min? (current placeholder: 60 min)
- Clinic hours: same every day, or different per day (e.g., closed Sunday, half-day Saturday)? (current placeholder: 10 AM–6 PM, daily, with 1–2 PM lunch break)
- Number of concurrent bookings per slot: 1 (single chair) or more? (current placeholder: 1 — single chair/dentist)

### 6.3 Admin dashboard
- Protected by login (v1: simple password; Phase 2 option: proper email/password auth via Supabase Auth if multiple staff need access)
- **Week-view calendar**: rows = time slots, columns = days
- Booked slots show patient name + phone
- Click any slot to open a modal:
  - If booked: edit name/phone/time, or cancel (delete) the booking
  - If empty: manually add a walk-in booking
- Summary stats: total bookings for the visible week

### 6.4 Data model (see `schema.sql`)
- `bookings` table: id, date, time_slot, patient_name, phone, status (booked/cancelled), created_at
- Admin auth: Supabase Auth (email/password) or simple environment-variable password check for v1

---

## 7. Non-Functional Requirements

- **Performance:** Lighthouse score 90+ on mobile; images optimized/lazy-loaded
- **SEO:**
  - Semantic HTML, descriptive meta titles/descriptions per section
  - `LocalBusiness` + `Dentist` schema.org JSON-LD markup with real NAP (Name, Address, Phone) matching Google Business Profile exactly
  - City/service-specific keywords in headings and copy (e.g., "Root Canal Treatment in [City]")
  - Sitemap.xml, robots.txt
  - Fast load (hosting on Vercel edge network)
- **Accessibility:** Adequate color contrast, tappable target sizes (44px+), alt text on all images
- **Security:** No sensitive data stored beyond name/phone; admin route protected; environment variables for secrets (Supabase keys)
- **Responsiveness:** Mobile-first; must look correct on common breakpoints (375px, 768px, 1280px)

---

## 8. Tech Stack

| Layer | Choice | Cost |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | Free |
| Database | Supabase (Postgres, free tier) | Free (up to 500MB) |
| Hosting | Vercel (free tier) | Free |
| Domain | Client-purchased (.com/.in) | ₹500–1,200/year |
| SSL | Included via Vercel | Free |
| Icons | lucide-react | Free |

**Phase 2 optional additions:** SMS/WhatsApp confirmation (Twilio/MSG91/WhatsApp Business API — pay-as-you-go), custom email (Zoho Mail free tier), Google Places API for live reviews.

---

## 9. Design Direction

- Reference: Grand Street Dental (approved by client) — clean, modern, organic shape accents rather than stock photography, mobile-first with sticky bottom nav
- Palette, typography, logo: `[TBD — client to confirm or approve proposed system]`
- Proposed placeholder palette (used in existing demo): deep teal `#134E4A`, sage `#7C9885`, warm ivory `#F6F2EA`, coral accent `#D9744F`
- Proposed typography: serif display font for headlines (warmth + trust), clean sans-serif for body/UI

---

## 10. Open Questions / Info Needed From Client

1. Final clinic name, exact address, phone number (must match Google Business Profile exactly)
2. City (for SEO targeting)
3. Full services list
4. Clinic hours per day + slot length + single vs. multi-chair
5. Logo file, or approval to design a text-based logo
6. Real before/after photos (with patient consent) — or proceed with placeholders for launch and swap later
7. 4–6 real Google reviews to feature, or permission to pull top reviews from her listing
8. Domain name preference (for registration)
9. Confirmation channel preference for Phase 2 (SMS vs WhatsApp vs none)

---

## 11. Milestones

1. **Phase 0 — Setup:** Repo, Supabase project, Vercel project, domain DNS
2. **Phase 1 — Static site:** Homepage sections built with placeholder content
3. **Phase 2 — Booking system:** Booking form + Supabase integration + admin dashboard
4. **Phase 3 — Real content pass:** Swap in real copy, photos, reviews, logo once received
5. **Phase 4 — SEO + launch:** Schema markup, meta tags, sitemap, domain go-live, Google Business Profile cross-check
6. **Phase 5 (optional) — Confirmations:** SMS/WhatsApp booking confirmations
