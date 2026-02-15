# Wattle App

This is the Next.js application for Wattle.

## 🚀 Quick Start

**NEW SETUP (Day 1):**

```bash
# 1. Run automated setup
./setup.sh

# 2. Start development server
npm run dev

# 3. (Optional) Seed test data
npx prisma db seed
```

**Test Credentials:**
- Manager: `manager@wattle.com` / `password123`
- Owner: `owner@example.com` / `password123`

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[DAY-1-CHECKLIST.md](DAY-1-CHECKLIST.md)** | Today's tasks & verification |
| **[SETUP-INSTRUCTIONS.md](SETUP-INSTRUCTIONS.md)** | Detailed setup guide |
| **[../docs/](../docs/)** | Complete implementation plan |

---

## 🛠️ Tech Stack (Updated)

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Supabase - Sydney region) ✨ NEW
- **API**: tRPC v11 (type-safe APIs) ✨ NEW
- **Auth**: Better-Auth (modern auth) ✨ NEW
- **Email**: Resend + React Email ✨ NEW
- **Storage**: Supabase Storage ✨ NEW
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **State**: TanStack Query + Zustand ✨ NEW
- **Animations**: Framer Motion ✨ NEW

---

## 📁 Directory Structure

```
app/
├── src/
│   ├── app/              # Next.js pages
│   │   ├── api/          # API routes
│   │   ├── auth/         # Auth pages
│   │   └── dashboard/    # Protected pages
│   ├── components/       # React components
│   │   └── ui/          # shadcn/ui components
│   └── lib/             # Utilities
│       ├── db.ts        # Prisma client
│       ├── session.ts   # Session management
│       └── utils.ts     # Helper functions
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.ts          # Seed data
│   └── migrations/      # Migration history
├── emails/              # Email templates (coming soon)
├── server/              # tRPC backend (coming soon)
└── .env.local          # Environment variables
```

---

## 🗄️ Database

**Provider**: PostgreSQL on Supabase
**Region**: Sydney (ap-southeast-2)
**Connection**: See `.env.local`

**Useful Commands:**
```bash
# Open Prisma Studio (visual database browser)
npx prisma studio

# Create new migration
npx prisma migrate dev --name description

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Seed database
npx prisma db seed
```

---

## 🎯 Current Status

**Progress**: 20% of MVP complete

**Completed:**
- ✅ Database migrated to PostgreSQL
- ✅ Modern dependencies installed
- ✅ Supabase storage configured
- ✅ Test data seeded
- ✅ Basic auth working

**Next Steps (Day 2):**
- [ ] Set up tRPC
- [ ] Implement Better-Auth
- [ ] Add email service
- [ ] Build file upload component

---

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

---

## 📊 Features Status

| Module | Status | Progress |
|--------|--------|----------|
| Authentication | 🟡 Basic | 40% |
| Dashboard | 🟡 Layout only | 20% |
| Maintenance | 🔴 Empty | 5% |
| Announcements | 🔴 Empty | 5% |
| Documents | 🔴 Empty | 5% |
| Finance | 🔴 Empty | 0% |
| Building Setup | 🔴 Not started | 0% |

**Legend:**
- 🟢 Complete
- 🟡 In Progress
- 🔴 Not Started

---

## 🚨 Troubleshooting

**Database connection fails:**
```bash
# Check .env.local
cat .env.local | grep DATABASE_URL

# Test connection
npx prisma studio
```

**App won't start:**
```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

**TypeScript errors:**
```bash
# Regenerate Prisma client
npx prisma generate

# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Better-Auth Documentation](https://better-auth.com)

---

## 🎉 Quick Wins

**See your data:**
```bash
npx prisma studio
```

**Test login:**
1. Go to http://localhost:3000/auth/login
2. Email: `manager@wattle.com`
3. Password: `password123`
4. Should see dashboard with real data!

---

**For detailed implementation guide, see: [../docs/00-IMPLEMENTATION-SUMMARY.md](../docs/00-IMPLEMENTATION-SUMMARY.md)**
