# StrataHub — MVP Implementation Roadmap
## Modern UI-First Approach to Win Customers

---

## 🎯 Core Philosophy: UI as Competitive Moat

**The Problem**: Competitors have ugly, dated interfaces. We win by being 10x better looking.

**The Solution**: Build a UI so beautiful that strata managers show it off to clients. Think:
- Linear's polish
- Notion's simplicity  
- Stripe's clarity
- Vercel's speed

---

## 🎨 UI Design System (Week 1)

### Visual Identity

**Color Palette**
```
Primary: Indigo 600 (#4F46E5) - Trust, professionalism
Secondary: Emerald 500 (#10B981) - Growth, positive actions
Accent: Amber 500 (#F59E0B) - Warnings, attention
Neutral: Slate 50-900 - Clean, modern
Error: Rose 500 (#EF4444)
Success: Emerald 500
```

**Typography**
- Headings: Inter (700, 600, 500)
- Body: Inter (400, 500)
- Monospace: JetBrains Mono (for codes, IDs)

**Spacing System**
- Base: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96

### Component Library Enhancement

**Beyond shadcn/ui basics, add:**

1. **Empty States** - Beautiful illustrations (use Undraw or custom)
2. **Loading Skeletons** - Shimmer effects, not spinners
3. **Toast Notifications** - Sonner library for smooth notifications
4. **Command Palette** - Cmd+K for power users (cmdk)
5. **Data Tables** - TanStack Table with sorting, filtering, pagination
6. **File Upload** - Drag-drop zones with progress (react-dropzone)
7. **Rich Text Editor** - Tiptap for announcements
8. **Charts** - Recharts with custom styling
9. **Avatars** - User initials with color generation
10. **Status Badges** - Color-coded, animated when active

### Animation Strategy

**Micro-interactions** (Framer Motion)
- Page transitions: Fade + slide up (200ms)
- Card hover: Lift + shadow (150ms)
- Button press: Scale down (100ms)
- List items: Stagger animation (50ms delay)
- Success actions: Confetti or checkmark animation

**Performance Budget**
- First Contentful Paint: < 1.2s
- Time to Interactive: < 2.5s
- Lighthouse Score: 95+

---

## 🏗️ Technical Architecture Overhaul

### Stack Decisions (Final)

```typescript
// Tech Stack v2.0
{
  "frontend": {
    "framework": "Next.js 15 (App Router)",
    "language": "TypeScript 5.7",
    "styling": "Tailwind CSS v4 + shadcn/ui",
    "state": "Zustand + TanStack Query v5",
    "forms": "React Hook Form + Zod",
    "animations": "Framer Motion"
  },
  "backend": {
    "api": "tRPC v11 (not Server Actions)",
    "database": "PostgreSQL 16 (Supabase)",
    "orm": "Prisma 7",
    "auth": "Better-Auth (modern NextAuth alternative)",
    "email": "Resend + React Email",
    "storage": "Supabase Storage (S3-compatible)",
    "jobs": "Trigger.dev (serverless background jobs)",
    "cache": "Upstash Redis"
  },
  "infrastructure": {
    "hosting": "Vercel",
    "database": "Supabase (Sydney region)",
    "monitoring": "Sentry + Axiom",
    "analytics": "PostHog"
  }
}
```

### Why These Changes?


**tRPC over Server Actions**
- Type-safe APIs for mobile apps (Phase 4)
- Better error handling and middleware
- Easier testing and mocking
- React Query integration for caching

**Better-Auth over NextAuth**
- Modern, lightweight, better DX
- Built-in MFA, magic links, OAuth
- Better TypeScript support
- Easier customization

**Trigger.dev over BullMQ**
- Serverless, no infrastructure
- Built-in retries and monitoring
- Better DX with TypeScript
- Free tier sufficient for MVP

**Supabase over AWS RDS**
- Faster setup (hours vs days)
- Built-in auth, storage, realtime
- Australian region available
- Better pricing for startups

---

## 📅 12-Week Sprint Plan

### Week 1-2: Foundation & Infrastructure

**Goals**: Set up modern tech stack, design system, dev environment

**Tasks**:
- [ ] Migrate from SQLite to Supabase PostgreSQL
- [ ] Set up tRPC with React Query
- [ ] Implement Better-Auth (email/password + magic link)
- [ ] Add password reset + email verification
- [ ] Set up Resend for transactional emails
- [ ] Create email templates (React Email)
- [ ] Set up Upstash Redis for caching
- [ ] Configure environment variables (t3-env)
- [ ] Set up Sentry error tracking
- [ ] Create comprehensive component library
- [ ] Build design system documentation (Storybook)
- [ ] Set up Framer Motion animations

**Deliverables**:
- ✅ Working auth with email verification
- ✅ Beautiful login/signup pages
- ✅ Component library with 20+ components
- ✅ Animation system in place

---

### Week 3-4: Multi-Tenancy & Building Setup

**Goals**: Core data model, onboarding wizard, RBAC

**UI Focus**: Onboarding wizard that feels like magic

**Tasks**:
- [ ] Implement multi-tenant architecture (org_id on all tables)
- [ ] Build onboarding wizard (5 steps):
  1. Welcome + building name
  2. Address + strata details
  3. Upload building photo
  4. Add lots/units (bulk import CSV option)
  5. Invite first members
- [ ] Create building dashboard (overview)
- [ ] Implement RBAC middleware (tRPC)
- [ ] Build role management UI
- [ ] Create member invitation system
- [ ] Add member directory with search
- [ ] Implement user profile pages
- [ ] Add building settings page

**UI Components**:

- Multi-step wizard with progress indicator
- Building card with hero image
- Member cards with avatars and roles
- Invite modal with email validation
- CSV upload with preview and validation
- Success animations (confetti on completion)

**Deliverables**:
- ✅ Smooth onboarding (< 5 minutes)
- ✅ Multi-tenant data isolation working
- ✅ RBAC enforced on all endpoints
- ✅ Beautiful member directory

---

### Week 5-6: Maintenance Module (Core Feature #1)

**Goals**: Full maintenance request lifecycle

**UI Focus**: Mobile-first, photo-heavy, status-driven

**Tasks**:
- [ ] Build maintenance request form:
  - Photo upload (drag-drop, mobile camera)
  - Category selection (icons + colors)
  - Priority selection (visual indicators)
  - Location picker (floor + unit)
  - Rich text description
- [ ] Create maintenance list view:
  - Filterable by status, category, priority
  - Sortable by date, priority
  - Search by title/description
  - Kanban board view option
- [ ] Build maintenance detail page:
  - Photo gallery (lightbox)
  - Status timeline (visual progress)
  - Comments/updates thread
  - Assignment to contractor
  - Before/after photos
- [ ] Implement status workflow:
  - Submitted → Reviewed → In Progress → Resolved → Closed
  - Email notifications on status change
  - Push notifications (web push API)
- [ ] Add contractor management:
  - Contractor directory
  - Assignment UI
  - Contact details

**UI Components**:
- Photo upload zone with preview grid
- Status badge with color coding
- Priority indicator (urgent = pulsing red)
- Timeline component (vertical, animated)
- Kanban board (drag-drop with dnd-kit)
- Image lightbox (yet-another-react-lightbox)
- Comment thread (real-time updates)

**Deliverables**:
- ✅ End-to-end maintenance workflow
- ✅ Mobile-optimized photo upload
- ✅ Real-time status updates
- ✅ Email notifications working

---

### Week 7-8: Announcements & Communication

**Goals**: Noticeboard, announcements, notifications

**UI Focus**: Social feed aesthetic, easy scanning

**Tasks**:
- [ ] Build announcement creation:
  - Rich text editor (Tiptap)
  - Image upload (hero images)
  - Target audience selector
  - Pin to top option
  - Schedule publishing
- [ ] Create announcement feed:
  - Card-based layout
  - Pinned items at top (highlighted)
  - Infinite scroll
  - Read/unread indicators
  - Reactions (like, important)
- [ ] Implement notification system:
  - In-app notification center
  - Email digest (daily/weekly)
  - Web push notifications
  - Notification preferences
- [ ] Add comment system:
  - Threaded comments
  - @mentions
  - Real-time updates (Supabase Realtime)

**UI Components**:
- Rich text editor with toolbar
- Announcement card (image + text)
- Notification dropdown (bell icon)
- Comment thread with avatars
- Reaction picker
- Empty state (no announcements yet)

**Deliverables**:
- ✅ Beautiful announcement feed
- ✅ Rich text editing
- ✅ Notification system working
- ✅ Real-time comments

---

### Week 9-10: Document Management

**Goals**: Secure document storage, organization, search

**UI Focus**: Dropbox-like simplicity

**Tasks**:
- [ ] Build document upload:
  - Drag-drop multi-file upload
  - Progress indicators
  - File type validation
  - Size limits (50MB per file)
  - Virus scanning (ClamAV via API)
- [ ] Create document library:
  - Folder structure (categories)
  - Grid + list view toggle
  - Search (full-text via Supabase)
  - Filter by category, date, uploader
  - Sort by name, date, size
- [ ] Implement document viewer:
  - PDF preview (react-pdf)
  - Image preview
  - Download button
  - Share link generation
  - Version history
- [ ] Add access control:
  - Role-based visibility
  - Expiry dates (insurance docs)
  - Expiry notifications (30 days before)

**UI Components**:
- File upload zone (animated)
- Document card (icon + metadata)
- Folder navigation (breadcrumbs)
- PDF viewer modal
- Search bar with instant results
- Filter sidebar
- Empty state (upload first doc)

**Deliverables**:
- ✅ Secure file upload/download
- ✅ Organized document library
- ✅ Search working
- ✅ Expiry notifications

---

### Week 11-12: Polish, Testing, Launch Prep

**Goals**: Production-ready, performant, delightful

**Tasks**:

- [ ] Performance optimization:
  - Image optimization (next/image)
  - Code splitting (dynamic imports)
  - Database query optimization (indexes)
  - Redis caching for hot data
  - CDN for static assets
- [ ] Error handling:
  - Error boundaries on all pages
  - Graceful fallbacks
  - User-friendly error messages
  - Sentry integration tested
- [ ] Loading states:
  - Skeleton screens everywhere
  - Optimistic updates
  - Smooth transitions
- [ ] Responsive design:
  - Mobile (320px+)
  - Tablet (768px+)
  - Desktop (1024px+)
  - Large desktop (1440px+)
- [ ] Accessibility:
  - Keyboard navigation
  - Screen reader support
  - ARIA labels
  - Color contrast (WCAG AA)
- [ ] Testing:
  - Unit tests (Vitest) - 80% coverage
  - Integration tests (API routes)
  - E2E tests (Playwright) - critical flows
  - Load testing (k6) - 100 concurrent users
- [ ] Landing page:
  - Hero section with demo video
  - Feature showcase
  - Pricing table
  - Testimonials (beta users)
  - FAQ section
  - CTA (Start Free Trial)
- [ ] Legal pages:
  - Privacy policy
  - Terms of service
  - Cookie policy
- [ ] Onboarding improvements:
  - Interactive product tour (Intro.js)
  - Tooltips for first-time users
  - Sample data for demo mode
- [ ] Admin panel:
  - User management
  - Building management
  - Analytics dashboard
  - Feature flags

**Deliverables**:
- ✅ Lighthouse score 95+
- ✅ Zero critical bugs
- ✅ All tests passing
- ✅ Landing page live
- ✅ 5 beta buildings onboarded

---

## 🎨 UI Design Patterns (Detailed)

### Dashboard Layout

```
┌─────────────────────────────────────────────────────┐
│  [Logo]  Building Name ▼    [Search] [Notif] [User] │ ← Header (sticky)
├─────────────────────────────────────────────────────┤
│ │                                                     │
│ │  📊 Overview                                        │
│ │  🏢 My Building        ┌──────────────────────┐   │
│S│  🔧 Maintenance        │  Welcome back, John! │   │
│I│  📢 Announcements      │                      │   │
│D│  📄 Documents          │  [Stats Cards x4]    │   │
│E│  💰 Finance            │                      │   │
│B│  👥 Members            │  [Activity Feed]     │   │
│A│                        │                      │   │
│R│  ─────────────         │  [Quick Actions]     │   │
│ │  [Sign Out]            └──────────────────────┘   │
│ │                                                     │
└─────────────────────────────────────────────────────┘
```

### Maintenance Request Card

```
┌─────────────────────────────────────────┐
│ 🔴 URGENT  #MR-1234  2 hours ago        │
│                                         │
│ Leaking Pipe in Unit 402                │
│ Water leaking from ceiling in bathroom  │
│                                         │
│ [Photo] [Photo] [Photo]                 │
│                                         │
│ 📍 Floor 4, Unit 402                    │
│ 👤 Submitted by John Doe                │
│ 🔧 Assigned to ABC Plumbing             │
│                                         │
│ Status: ⏳ In Progress                  │
│ ────────────────────────────────────    │
│ [View Details] [Update Status]          │
└─────────────────────────────────────────┘
```

### Announcement Card

```
┌─────────────────────────────────────────┐
│ 📌 PINNED                               │
│                                         │
│ [Hero Image - Building Maintenance]     │
│                                         │
│ Window Cleaning - Tuesday 15th          │
│ Posted by Building Manager • 3 days ago │
│                                         │
│ The window cleaning team will be...     │
│                                         │
│ 👍 12  💬 3 comments                    │
│ ────────────────────────────────────    │
│ [Read More] [Comment]                   │
└─────────────────────────────────────────┘
```

---

## 🔐 Security Implementation

### Authentication Flow (Better-Auth)

```typescript
// app/lib/auth.ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { db } from "./db"

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
  },
  magicLink: {
    enabled: true,
    expiresIn: 300, // 5 minutes
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  rateLimit: {
    enabled: true,
    window: 60, // 1 minute
    max: 10, // 10 requests
  },
})
```

### RBAC Middleware (tRPC)

```typescript
// app/server/trpc.ts
import { TRPCError } from "@trpc/server"

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  })
})

export const managerProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const membership = await db.buildingMembership.findFirst({
    where: {
      userId: ctx.session.userId,
      buildingId: ctx.buildingId,
      role: { in: ["manager", "committee"] },
    },
  })

  if (!membership) {
    throw new TRPCError({ code: "FORBIDDEN" })
  }

  return next({ ctx })
})
```

---

## 📊 Performance Optimization

### Caching Strategy

```typescript
// app/lib/cache.ts
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  const cached = await redis.get<T>(key)
  if (cached) return cached

  const data = await fetcher()
  await redis.setex(key, ttl, data)
  return data
}

// Usage
const building = await getCached(
  `building:${buildingId}`,
  () => db.building.findUnique({ where: { id: buildingId } }),
  3600 // 1 hour
)
```

### Database Indexes

```prisma
// prisma/schema.prisma
model MaintenanceRequest {
  // ... fields

  @@index([buildingId, status])
  @@index([submittedById])
  @@index([createdAt])
}

model Announcement {
  // ... fields

  @@index([buildingId, publishedAt])
  @@index([isPinned])
}

model Document {
  // ... fields

  @@index([buildingId, category])
  @@index([expiresAt])
}
```

---

## 📧 Email Templates

### Welcome Email

```tsx
// emails/welcome.tsx
import { Button, Html, Text } from "@react-email/components"

export default function WelcomeEmail({ name, buildingName }) {
  return (
    <Html>
      <Text>Hi {name},</Text>
      <Text>
        Welcome to StrataHub! You've been added to {buildingName}.
      </Text>
      <Button href="https://app.stratahub.com.au/dashboard">
        Go to Dashboard
      </Button>
    </Html>
  )
}
```

### Maintenance Status Update

```tsx
// emails/maintenance-update.tsx
export default function MaintenanceUpdateEmail({
  requestTitle,
  oldStatus,
  newStatus,
  buildingName,
}) {
  return (
    <Html>
      <Text>Maintenance Request Update</Text>
      <Text>
        "{requestTitle}" status changed from {oldStatus} to {newStatus}
      </Text>
      <Button href="https://app.stratahub.com.au/dashboard/maintenance">
        View Request
      </Button>
    </Html>
  )
}
```

---

## 🚀 Deployment Strategy

### Environment Setup

```bash
# .env.local (development)
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="..."
UPSTASH_REDIS_URL="..."
RESEND_API_KEY="..."
BETTER_AUTH_SECRET="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# .env.production
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="..."
UPSTASH_REDIS_URL="..."
RESEND_API_KEY="..."
BETTER_AUTH_SECRET="..."
NEXT_PUBLIC_APP_URL="https://app.stratahub.com.au"
```

### Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "regions": ["syd1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "SUPABASE_URL": "@supabase-url"
  }
}
```

---

## 📱 Mobile-First Design Principles

1. **Touch Targets**: Minimum 44x44px
2. **Font Sizes**: Minimum 16px (prevents zoom on iOS)
3. **Navigation**: Bottom tab bar on mobile
4. **Forms**: One column, large inputs
5. **Images**: Lazy loading, WebP format
6. **Gestures**: Swipe to delete, pull to refresh
7. **Offline**: Service worker for offline viewing

---

## 🎯 Success Metrics

### Week 4 Checkpoint
- [ ] 5 beta buildings signed up
- [ ] Auth flow completion rate > 90%
- [ ] Onboarding completion rate > 80%

### Week 8 Checkpoint
- [ ] 20+ maintenance requests submitted
- [ ] 50+ announcements posted
- [ ] User engagement: 3+ sessions/week

### Week 12 Launch
- [ ] 50 buildings onboarded
- [ ] 500+ active users
- [ ] NPS score > 40
- [ ] Lighthouse score 95+
- [ ] Zero critical bugs

---

## 💰 Cost Breakdown (Monthly)

```
Supabase Pro: $25
Upstash Redis: $10
Vercel Pro: $20
Resend: $20 (10k emails)
Trigger.dev: $0 (free tier)
Sentry: $0 (free tier)
Domain: $2
─────────────────
Total: ~$77/month
```

At 50 buildings × $49/month = $2,450 MRR
Gross margin: 97% 🚀

---

## 🎨 Design Inspiration

**Study these for UI patterns:**
- Linear (project management)
- Notion (content organization)
- Stripe Dashboard (data visualization)
- Vercel Dashboard (deployment UX)
- Superhuman (keyboard shortcuts)
- Height (task management)

**Key takeaways:**
- Fast, instant feedback
- Keyboard shortcuts everywhere
- Beautiful empty states
- Smooth animations
- Clear hierarchy
- Generous whitespace

---

## 🔄 Migration Plan (SQLite → PostgreSQL)

```bash
# 1. Export existing data
npx prisma db pull
npx prisma generate

# 2. Update schema for PostgreSQL
# Change provider in schema.prisma

# 3. Create migration
npx prisma migrate dev --name init

# 4. Seed Supabase database
npx prisma db seed

# 5. Update connection string
# Update DATABASE_URL in .env

# 6. Test thoroughly
npm run test
```

---

## ✅ Definition of Done (Each Feature)

- [ ] Code written and reviewed
- [ ] Unit tests passing (80%+ coverage)
- [ ] E2E test for happy path
- [ ] Mobile responsive
- [ ] Accessible (keyboard + screen reader)
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Empty states designed
- [ ] Animations smooth (60fps)
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] QA tested
- [ ] Product owner approved

---

## 🎓 Learning Resources

**For the team:**
- tRPC: https://trpc.io/docs
- Better-Auth: https://better-auth.com
- Framer Motion: https://framer.com/motion
- TanStack Query: https://tanstack.com/query
- Supabase: https://supabase.com/docs

---

## 🚨 Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Scope creep | Strict MVP feature list, say no to everything else |
| Performance issues | Load testing from Week 8, optimize early |
| Security breach | Penetration testing before launch, bug bounty |
| Low adoption | 5 beta users committed before building |
| Technical debt | Code reviews, refactor sprints every 4 weeks |
| Burnout | Sustainable pace, no weekends, celebrate wins |

---

## 🎉 Launch Day Checklist

- [ ] All MVP features complete
- [ ] 50 buildings onboarded
- [ ] Landing page live
- [ ] Blog post published
- [ ] LinkedIn announcement
- [ ] Email to waitlist (500+ people)
- [ ] Product Hunt launch
- [ ] Press release to AU property media
- [ ] Demo video on YouTube
- [ ] Support email monitored
- [ ] Analytics tracking verified
- [ ] Backup tested
- [ ] Incident response plan ready

---

**Next Steps**: Start Week 1 tasks immediately. Ship fast, iterate faster. 🚀
