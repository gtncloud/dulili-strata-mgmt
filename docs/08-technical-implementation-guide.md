# StrataHub — Technical Implementation Guide
## Step-by-Step Code Implementation

---

## 🚀 Week 1-2: Foundation Setup

### Step 1: Migrate to PostgreSQL (Supabase)

**1.1 Create Supabase Project**
```bash
# Go to supabase.com
# Create new project in Sydney region
# Copy connection string
```

**1.2 Update Prisma Schema**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}

// Keep all existing models...
```

**1.3 Environment Variables**
```bash
# .env.local
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
SUPABASE_URL="https://[project].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
```

**1.4 Run Migration**
```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

---

### Step 2: Set Up tRPC

**2.1 Install Dependencies**
```bash
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next
npm install @tanstack/react-query zod
npm install superjson
```

**2.2 Create tRPC Context**
```typescript
// app/server/context.ts
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function createContext() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return {
    db,
    session,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
```

**2.3 Create tRPC Router**
```typescript
// app/server/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server"
import { Context } from "./context"
import superjson from "superjson"

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

// Protected procedure - requires auth
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return next({
    ctx: {
      session: ctx.session,
      userId: ctx.session.user.id,
    },
  })
})

// Manager procedure - requires manager/committee role
export const managerProcedure = protectedProcedure.use(
  async ({ ctx, next, input }) => {
    const buildingId = (input as any).buildingId

    if (!buildingId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "buildingId is required",
      })
    }

    const membership = await ctx.db.buildingMembership.findFirst({
      where: {
        userId: ctx.userId,
        buildingId,
        role: { in: ["manager", "committee"] },
        status: "active",
      },
    })

    if (!membership) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have permission to perform this action",
      })
    }

    return next({ ctx: { ...ctx, membership } })
  }
)
```

**2.4 Create API Routers**
```typescript
// app/server/routers/maintenance.ts
import { router, protectedProcedure, managerProcedure } from "../trpc"
import { z } from "zod"

export const maintenanceRouter = router({
  // List maintenance requests
  list: protectedProcedure
    .input(
      z.object({
        buildingId: z.string(),
        status: z.enum(["submitted", "reviewed", "in_progress", "resolved", "closed"]).optional(),
        category: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { buildingId, status, category, limit, cursor } = input

      // Check user has access to building
      const membership = await ctx.db.buildingMembership.findFirst({
        where: {
          userId: ctx.userId,
          buildingId,
          status: "active",
        },
      })

      if (!membership) {
        throw new TRPCError({ code: "FORBIDDEN" })
      }

      const requests = await ctx.db.maintenanceRequest.findMany({
        where: {
          buildingId,
          ...(status && { status }),
          ...(category && { category }),
        },
        include: {
          submittedBy: {
            select: { id: true, name: true, avatarUrl: true },
          },
          assignedTo: {
            select: { id: true, name: true },
          },
          photos: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      })

      let nextCursor: string | undefined
      if (requests.length > limit) {
        const nextItem = requests.pop()
        nextCursor = nextItem!.id
      }

      return {
        requests,
        nextCursor,
      }
    }),

  // Get single maintenance request
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const request = await ctx.db.maintenanceRequest.findUnique({
        where: { id: input.id },
        include: {
          submittedBy: true,
          assignedTo: true,
          photos: true,
          building: true,
        },
      })

      if (!request) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      // Check access
      const membership = await ctx.db.buildingMembership.findFirst({
        where: {
          userId: ctx.userId,
          buildingId: request.buildingId,
          status: "active",
        },
      })

      if (!membership) {
        throw new TRPCError({ code: "FORBIDDEN" })
      }

      return request
    }),

  // Create maintenance request
  create: protectedProcedure
    .input(
      z.object({
        buildingId: z.string(),
        title: z.string().min(5).max(200),
        description: z.string().min(10),
        category: z.enum(["plumbing", "electrical", "structural", "cosmetic", "other"]),
        priority: z.enum(["low", "medium", "high", "urgent"]),
        location: z.string().optional(),
        photos: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { photos, ...data } = input

      const request = await ctx.db.maintenanceRequest.create({
        data: {
          ...data,
          submittedById: ctx.userId,
          status: "submitted",
          photos: photos
            ? {
                create: photos.map((url) => ({
                  url,
                  type: "before",
                })),
              }
            : undefined,
        },
        include: {
          submittedBy: true,
          photos: true,
        },
      })

      // TODO: Send notification to building manager
      // await sendMaintenanceNotification(request)

      return request
    }),

  // Update status (manager only)
  updateStatus: managerProcedure
    .input(
      z.object({
        id: z.string(),
        buildingId: z.string(),
        status: z.enum(["submitted", "reviewed", "in_progress", "resolved", "closed"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.maintenanceRequest.update({
        where: { id: input.id },
        data: {
          status: input.status,
          ...(input.status === "resolved" && { resolvedAt: new Date() }),
        },
      })

      // TODO: Send notification to submitter
      // await sendStatusUpdateNotification(request)

      return request
    }),

  // Assign to contractor (manager only)
  assign: managerProcedure
    .input(
      z.object({
        id: z.string(),
        buildingId: z.string(),
        assignedToId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.maintenanceRequest.update({
        where: { id: input.id },
        data: {
          assignedToId: input.assignedToId,
          status: "reviewed",
        },
      })

      return request
    }),
})
```

**2.5 Create Root Router**
```typescript
// app/server/routers/_app.ts
import { router } from "../trpc"
import { maintenanceRouter } from "./maintenance"
import { announcementRouter } from "./announcement"
import { documentRouter } from "./document"
import { buildingRouter } from "./building"

export const appRouter = router({
  maintenance: maintenanceRouter,
  announcement: announcementRouter,
  document: documentRouter,
  building: buildingRouter,
})

export type AppRouter = typeof appRouter
```

**2.6 Create API Route Handler**
```typescript
// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "@/server/routers/_app"
import { createContext } from "@/server/context"

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  })

export { handler as GET, handler as POST }
```

**2.7 Create tRPC Client**
```typescript
// app/lib/trpc/client.ts
"use client"

import { createTRPCReact } from "@trpc/react-query"
import { type AppRouter } from "@/server/routers/_app"

export const trpc = createTRPCReact<AppRouter>()
```

**2.8 Create tRPC Provider**
```typescript
// app/lib/trpc/provider.tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { useState } from "react"
import { trpc } from "./client"
import superjson from "superjson"

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  }))

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`,
          transformer: superjson,
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
```

**2.9 Add Provider to Layout**
```typescript
// app/src/app/layout.tsx
import { TRPCProvider } from "@/lib/trpc/provider"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  )
}
```

---

### Step 3: Implement Better-Auth

**3.1 Install Better-Auth**
```bash
npm install better-auth
npm install @better-auth/react
```

**3.2 Create Auth Configuration**
```typescript
// app/lib/auth.ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { db } from "./db"

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 60 * 24, // 24 hours
    sendVerificationEmail: async ({ user, url }) => {
      // Send email using Resend
      await sendVerificationEmail(user.email, url)
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  rateLimit: {
    enabled: true,
    window: 60, // 1 minute
    max: 10, // 10 requests
  },
  advanced: {
    generateId: () => crypto.randomUUID(),
  },
})
```

**3.3 Create Auth API Route**
```typescript
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
```

**3.4 Create Auth Client**
```typescript
// app/lib/auth-client.ts
"use client"

import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
})

export const { signIn, signUp, signOut, useSession } = authClient
```

---

### Step 4: Set Up Email Service (Resend)

**4.1 Install Resend**
```bash
npm install resend
npm install react-email @react-email/components
```

**4.2 Create Email Service**
```typescript
// app/lib/email.ts
import { Resend } from "resend"
import { WelcomeEmail } from "@/emails/welcome"
import { VerificationEmail } from "@/emails/verification"
import { MaintenanceUpdateEmail } from "@/emails/maintenance-update"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, url: string) {
  await resend.emails.send({
    from: "StrataHub <noreply@stratahub.com.au>",
    to: email,
    subject: "Verify your email",
    react: VerificationEmail({ verificationUrl: url }),
  })
}

export async function sendWelcomeEmail(email: string, name: string, buildingName: string) {
  await resend.emails.send({
    from: "StrataHub <hello@stratahub.com.au>",
    to: email,
    subject: `Welcome to ${buildingName}!`,
    react: WelcomeEmail({ name, buildingName }),
  })
}

export async function sendMaintenanceUpdateEmail(
  email: string,
  requestTitle: string,
  oldStatus: string,
  newStatus: string
) {
  await resend.emails.send({
    from: "StrataHub <notifications@stratahub.com.au>",
    to: email,
    subject: `Maintenance Update: ${requestTitle}`,
    react: MaintenanceUpdateEmail({ requestTitle, oldStatus, newStatus }),
  })
}
```

**4.3 Create Email Templates**
```typescript
// emails/verification.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface VerificationEmailProps {
  verificationUrl: string
}

export function VerificationEmail({ verificationUrl }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={heading}>Verify your email</Text>
            <Text style={text}>
              Click the button below to verify your email address and get started with StrataHub.
            </Text>
            <Button style={button} href={verificationUrl}>
              Verify Email
            </Button>
            <Text style={footer}>
              This link will expire in 24 hours. If you didn't request this email, you can safely ignore it.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const section = {
  padding: "0 48px",
}

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
}

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#484848",
}

const button = {
  backgroundColor: "#4F46E5",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
}

const footer = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#9ca299",
  marginTop: "32px",
}
```

---

### Step 5: Set Up File Upload (Supabase Storage)

**5.1 Create Storage Bucket**
```typescript
// Run this once to create bucket
// In Supabase Dashboard: Storage > Create Bucket
// Name: "maintenance-photos"
// Public: false
```

**5.2 Create Upload Utility**
```typescript
// app/lib/storage.ts
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function uploadFile(
  file: File,
  bucket: string,
  path: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}
```

**5.3 Create Upload Component**
```typescript
// app/components/file-upload.tsx
"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"
import { uploadFile } from "@/lib/storage"

interface FileUploadProps {
  onUpload: (urls: string[]) => void
  maxFiles?: number
  accept?: Record<string, string[]>
}

export function FileUpload({ onUpload, maxFiles = 5, accept }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles].slice(0, maxFiles))
  }, [maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles,
  })

  const handleUpload = async () => {
    setUploading(true)
    try {
      const urls = await Promise.all(
        files.map((file) =>
          uploadFile(
            file,
            "maintenance-photos",
            `${Date.now()}-${file.name}`
          )
        )
      )
      setUploadedUrls(urls)
      onUpload(urls)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          ${isDragActive ? "border-primary-500 bg-primary-50" : "border-slate-300"}
          ${uploading ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-slate-400" />
        <p className="mt-2 text-sm text-slate-600">
          {isDragActive
            ? "Drop files here..."
            : "Drag & drop files here, or click to select"}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Max {maxFiles} files
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <span className="text-sm text-slate-700">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      )}
    </div>
  )
}
```

---

## ✅ Week 1-2 Deliverables Checklist

- [ ] PostgreSQL database on Supabase (Sydney region)
- [ ] Prisma schema migrated and working
- [ ] tRPC set up with type-safe APIs
- [ ] Better-Auth implemented with email verification
- [ ] Resend email service configured
- [ ] Email templates created (verification, welcome)
- [ ] File upload working (Supabase Storage)
- [ ] Environment variables properly configured
- [ ] All dependencies installed
- [ ] Development server running smoothly

**Next**: Week 3-4 - Multi-tenancy & Building Setup
