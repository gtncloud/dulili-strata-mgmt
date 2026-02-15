# StrataHub — Technical Implementation Plan

## 1. Technology Stack

### Frontend
| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SEO, SSR, file-based routing, React Server Components |
| **Language** | TypeScript | Type safety, better DX, fewer runtime errors |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Rapid UI development, consistent design system |
| **State Management** | Zustand + TanStack Query | Lightweight global state + server state caching |
| **Forms** | React Hook Form + Zod | Performant forms with schema validation |
| **Charts** | Recharts | Financial dashboards and analytics |
| **Rich Text** | Tiptap | Announcements, meeting minutes editor |
| **File Upload** | UploadThing or AWS S3 direct | Document and photo uploads |

### Backend
| Layer | Technology | Why |
|---|---|---|
| **Runtime** | Node.js 22 LTS | JavaScript ecosystem, large talent pool |
| **API** | Next.js API Routes + tRPC | End-to-end type safety, co-located with frontend |
| **Database** | PostgreSQL 16 (via Supabase or AWS RDS) | Relational data, multi-tenancy, battle-tested |
| **ORM** | Prisma | Type-safe database queries, migrations |
| **Auth** | NextAuth.js v5 (Auth.js) | Flexible auth with magic links, Google, email/password |
| **Email** | Resend + React Email | Transactional emails (levy notices, notifications) |
| **Background Jobs** | Inngest or BullMQ | Scheduled jobs (reminders, reports, notifications) |
| **File Storage** | AWS S3 (ap-southeast-2) | Document storage, Australian data residency |
| **Search** | Meilisearch | Full-text search for documents and announcements |

### Infrastructure
| Layer | Technology | Why |
|---|---|---|
| **Hosting** | Vercel (frontend) + AWS (backend services) | Edge performance + Australian data residency |
| **Database Hosting** | Supabase (Sydney region) or AWS RDS | Managed Postgres with AU data residency |
| **CDN** | Vercel Edge / CloudFront | Global asset delivery |
| **Monitoring** | Sentry (errors) + PostHog (analytics) | Error tracking + product analytics |
| **CI/CD** | GitHub Actions | Automated testing, deployment |
| **Secrets** | Vercel Environment Variables / AWS Secrets Manager | Secure config management |

### Mobile (Phase 4)
| Layer | Technology | Why |
|---|---|---|
| **Framework** | React Native (Expo) | Code sharing with web, single codebase |
| **Push Notifications** | Expo Notifications + FCM/APNs | Cross-platform push notifications |

---

## 2. System Architecture

```
┌──────────────────────────────────────────────────┐
│                    CLIENTS                        │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Web App  │  │ iOS App  │  │  Android App  │  │
│  │ (Next.js)│  │ (Expo)   │  │  (Expo)       │  │
│  └────┬─────┘  └────┬─────┘  └──────┬────────┘  │
│       └──────────────┼───────────────┘            │
└──────────────────────┼────────────────────────────┘
                       │ HTTPS
┌──────────────────────┼────────────────────────────┐
│                 API LAYER                          │
│  ┌───────────────────┼───────────────────────┐    │
│  │           Next.js API + tRPC               │    │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────┐  │   │
│  │  │  Auth    │ │  RBAC    │ │ Rate Limit│  │    │
│  │  │  Layer   │ │  Layer   │ │  Layer    │  │    │
│  │  └──────────┘ └──────────┘ └───────────┘  │    │
│  └───────────────────┼───────────────────────┘    │
└──────────────────────┼────────────────────────────┘
                       │
┌──────────────────────┼────────────────────────────┐
│              SERVICE LAYER                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Building │ │  Maint.  │ │ Finance  │          │
│  │ Service  │ │ Service  │ │ Service  │          │
│  ├──────────┤ ├──────────┤ ├──────────┤          │
│  │  Comms   │ │  Docs    │ │  Voting  │          │
│  │ Service  │ │ Service  │ │ Service  │          │
│  └──────────┘ └──────────┘ └──────────┘          │
└──────────────────────┼────────────────────────────┘
                       │
┌──────────────────────┼────────────────────────────┐
│              DATA LAYER                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │PostgreSQL│ │  AWS S3  │ │Meilisearch│         │
│  │(Supabase)│ │ (Sydney) │ │  (Search) │         │
│  └──────────┘ └──────────┘ └──────────┘          │
└───────────────────────────────────────────────────┘
```

---

## 3. Database Schema (Core Tables)

### Multi-Tenancy Model
We use **Row-Level Security (RLS)** with an `organisation_id` on every table, ensuring data isolation between strata schemes.

### Core Tables

```sql
-- Organisations (Strata Management Firms)
organisations
  id, name, abn, plan, subscription_status, created_at

-- Buildings (Strata Schemes)
buildings
  id, organisation_id, name, address, state, strata_plan_number,
  total_lots, admin_fund_balance, capital_works_balance, created_at

-- Lots (Units/Apartments)  
lots
  id, building_id, lot_number, unit_number, floor,
  unit_entitlement, owner_id, created_at

-- Users
users
  id, email, name, phone, avatar_url, created_at

-- Building Memberships (links users to buildings with roles)
building_memberships
  id, user_id, building_id, lot_id, role (owner|tenant|committee|manager),
  status (active|inactive), joined_at

-- Maintenance Requests
maintenance_requests
  id, building_id, lot_id, submitted_by, title, description,
  category (plumbing|electrical|structural|cosmetic|other),
  priority (low|medium|high|urgent), status (submitted|reviewed|
  in_progress|resolved|closed), assigned_to, resolved_at, created_at

-- Maintenance Photos
maintenance_photos
  id, maintenance_request_id, url, caption, type (before|after), created_at

-- Announcements
announcements
  id, building_id, author_id, title, content, is_pinned,
  target_audience (all|owners|tenants|committee), published_at, created_at

-- Documents
documents
  id, building_id, uploaded_by, name, category (insurance|minutes|
  financial|compliance|bylaws|other), file_url, file_size,
  version, expires_at, created_at

-- Levies
levies
  id, building_id, lot_id, period, amount, due_date,
  status (pending|paid|overdue), paid_at, payment_reference, created_at

-- Financial Transactions
transactions
  id, building_id, type (income|expense), category, description,
  amount, date, receipt_url, approved_by, created_at

-- Meetings
meetings
  id, building_id, type (agm|egm|committee), title, description,
  scheduled_at, location, status (scheduled|in_progress|completed),
  minutes_content, created_at

-- Motions
motions
  id, meeting_id, building_id, title, description, type (ordinary|special|
  unanimous), status (draft|open|closed), votes_for, votes_against,
  votes_abstain, result (passed|failed|deferred), created_at

-- Votes
votes
  id, motion_id, user_id, lot_id, vote (for|against|abstain),
  is_proxy, proxy_holder_id, created_at
```

---

## 4. MVP Feature Scope (Phase 1 — Weeks 1-12)

### Sprint 1-2: Foundation (Weeks 1-4)
- [ ] Project setup (Next.js, Prisma, Supabase, Tailwind, shadcn/ui)
- [ ] Authentication (email/password + magic link)
- [ ] Multi-tenant organisation setup
- [ ] Building creation wizard
- [ ] Lot/unit management
- [ ] User invitation flow (invite by email)
- [ ] Role-based access control (owner, tenant, committee, manager)

### Sprint 3-4: Core Features (Weeks 5-8)
- [ ] Resident directory with search and filters
- [ ] Announcements/noticeboard (create, read, pin)
- [ ] Maintenance request submission (with photo upload)
- [ ] Maintenance request tracking (status updates)
- [ ] Document library (upload, categorise, download)
- [ ] Building dashboard (summary view)
- [ ] Email notifications for key events

### Sprint 5-6: Polish & Launch (Weeks 9-12)
- [ ] Responsive mobile design
- [ ] Onboarding wizard (guided building setup)
- [ ] Settings page (building details, user roles)
- [ ] Landing page & marketing website
- [ ] Privacy policy & terms of service pages
- [ ] Error handling & loading states
- [ ] Performance optimisation
- [ ] Deployment to production
- [ ] Analytics integration (PostHog)
- [ ] Beta user testing & feedback

---

## 5. API Design (tRPC Routers)

```
trpc/
├── auth/
│   ├── signUp
│   ├── signIn
│   ├── signOut
│   └── getSession
├── organisations/
│   ├── create
│   ├── get
│   └── update
├── buildings/
│   ├── create
│   ├── list
│   ├── get
│   ├── update
│   └── delete
├── lots/
│   ├── create
│   ├── list
│   ├── get
│   └── update
├── members/
│   ├── invite
│   ├── list
│   ├── updateRole
│   └── remove
├── maintenance/
│   ├── create
│   ├── list
│   ├── get
│   ├── updateStatus
│   ├── assign
│   └── addPhoto
├── announcements/
│   ├── create
│   ├── list
│   ├── get
│   ├── update
│   ├── pin
│   └── delete
├── documents/
│   ├── upload
│   ├── list
│   ├── get
│   ├── download
│   └── delete
├── finance/
│   ├── getLevies
│   ├── createLevy
│   ├── recordPayment
│   ├── getTransactions
│   ├── createTransaction
│   └── getDashboard
├── meetings/
│   ├── create
│   ├── list
│   ├── get
│   └── addMinutes
├── motions/
│   ├── create
│   ├── list
│   ├── castVote
│   └── getResults
└── notifications/
    ├── list
    ├── markRead
    └── updatePreferences
```

---

## 6. Deployment Architecture

### Environments
| Environment | Purpose | URL |
|---|---|---|
| **Local** | Development | localhost:3000 |
| **Preview** | PR previews (auto-deployed) | pr-{n}.stratahub.dev |
| **Staging** | Pre-production testing | staging.stratahub.com.au |
| **Production** | Live application | app.stratahub.com.au |

### CI/CD Pipeline (GitHub Actions)

```
Push to branch
  → Run linter (ESLint)
  → Run type check (tsc)
  → Run unit tests (Vitest)
  → Run E2E tests (Playwright)
  → Deploy to Preview (Vercel)

Merge to main
  → All checks above
  → Deploy to Staging
  → Smoke tests on Staging
  → Manual approval
  → Deploy to Production
```

---

## 7. Security Measures

| Measure | Implementation |
|---|---|
| **Authentication** | NextAuth.js with bcrypt password hashing, magic link option |
| **Authorization** | RBAC middleware on all API routes |
| **Data isolation** | Row-Level Security (RLS) on Supabase, org_id on every query |
| **Input validation** | Zod schemas on all API inputs |
| **Rate limiting** | Upstash Redis rate limiter on auth + API endpoints |
| **CSRF protection** | SameSite cookies + CSRF tokens |
| **XSS prevention** | React auto-escaping + Content Security Policy headers |
| **SQL injection** | Prisma parameterised queries (never raw SQL) |
| **File upload security** | File type validation, virus scanning, size limits |
| **Secrets management** | Environment variables, never committed to git |
| **Audit logging** | Log all data mutations with user, timestamp, IP |
| **Dependency scanning** | GitHub Dependabot + Snyk for vulnerability alerts |

---

## 8. Development Workflow

### Git Branching
```
main (production)
  └── develop (staging)
       ├── feature/building-setup
       ├── feature/maintenance-module
       ├── feature/announcements
       └── fix/auth-redirect
```

### Code Quality
- **ESLint** — Strict TypeScript rules
- **Prettier** — Consistent formatting
- **Husky** — Pre-commit hooks (lint + type check)
- **Conventional Commits** — Standardised commit messages
- **PR Reviews** — Required before merge (when team grows)

### Testing Strategy
| Type | Tool | Coverage Target |
|---|---|---|
| **Unit Tests** | Vitest | 80% of business logic |
| **Integration Tests** | Vitest + Supertest | All API endpoints |
| **E2E Tests** | Playwright | Critical user flows |
| **Visual Regression** | Chromatic (Storybook) | Key UI components |

---

## 9. Domain & Branding Setup

- [ ] Register domain: **stratahub.com.au** (and .au)
- [ ] Set up Google Workspace: hello@stratahub.com.au
- [ ] Social media: LinkedIn, Facebook, Instagram, YouTube
- [ ] Register trademark: StrataHub® (IP Australia)
- [ ] Design logo and brand kit

---

## 10. Launch Checklist

- [ ] MVP features complete and tested
- [ ] Landing page live with waitlist
- [ ] Privacy policy & terms of service published
- [ ] Error monitoring live (Sentry)
- [ ] Analytics live (PostHog)
- [ ] Transactional emails tested (Resend)
- [ ] SSL certificate active
- [ ] Backup & recovery tested
- [ ] Load testing passed (k6)
- [ ] 5 beta buildings onboarded and providing feedback
- [ ] App Store / Play Store listings prepared (Phase 4)
- [ ] Support email / help centre set up (Intercom or Crisp)
