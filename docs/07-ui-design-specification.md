# StrataHub — UI Design Specification
## Building a UI That Sells Itself

---

## 🎯 Design Philosophy

**Core Principle**: Every pixel should justify the $49/month price tag.

**Design Values**:
1. **Clarity over Cleverness** - Users should never be confused
2. **Speed over Spectacle** - Fast > flashy
3. **Consistency over Creativity** - Predictable patterns
4. **Accessibility over Aesthetics** - Beautiful AND usable

---

## 🎨 Visual Design System

### Color System

```css
/* Primary Palette - Trust & Professionalism */
--primary-50: #EEF2FF;
--primary-100: #E0E7FF;
--primary-500: #6366F1;  /* Main brand color */
--primary-600: #4F46E5;  /* Hover states */
--primary-700: #4338CA;  /* Active states */
--primary-900: #312E81;  /* Text on light bg */

/* Success - Positive Actions */
--success-50: #ECFDF5;
--success-500: #10B981;
--success-600: #059669;

/* Warning - Attention Needed */
--warning-50: #FFFBEB;
--warning-500: #F59E0B;
--warning-600: #D97706;

/* Error - Critical Issues */
--error-50: #FEF2F2;
--error-500: #EF4444;
--error-600: #DC2626;

/* Neutral - UI Elements */
--slate-50: #F8FAFC;   /* Page background */
--slate-100: #F1F5F9;  /* Card background */
--slate-200: #E2E8F0;  /* Borders */
--slate-400: #94A3B8;  /* Disabled text */
--slate-600: #475569;  /* Secondary text */
--slate-900: #0F172A;  /* Primary text */
```

### Typography Scale

```css
/* Font Family */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px - Labels, captions */
--text-sm: 0.875rem;   /* 14px - Body small */
--text-base: 1rem;     /* 16px - Body */
--text-lg: 1.125rem;   /* 18px - Subheadings */
--text-xl: 1.25rem;    /* 20px - Headings */
--text-2xl: 1.5rem;    /* 24px - Page titles */
--text-3xl: 1.875rem;  /* 30px - Hero text */
--text-4xl: 2.25rem;   /* 36px - Landing page */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Spacing System

```css
/* Base: 4px */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Border Radius

```css
--radius-sm: 0.375rem;  /* 6px - Buttons, badges */
--radius-md: 0.5rem;    /* 8px - Cards, inputs */
--radius-lg: 0.75rem;   /* 12px - Modals */
--radius-xl: 1rem;      /* 16px - Hero sections */
--radius-full: 9999px;  /* Pills, avatars */
```

### Shadows

```css
/* Elevation System */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Interactive Shadows */
--shadow-hover: 0 10px 20px -5px rgb(0 0 0 / 0.15);
--shadow-focus: 0 0 0 3px rgb(99 102 241 / 0.3);
```

---

## 🧩 Component Library

### 1. Buttons

**Primary Button**
```tsx
<Button variant="primary" size="md">
  Create Request
</Button>
```

**Variants**: primary, secondary, outline, ghost, danger
**Sizes**: sm (32px), md (40px), lg (48px)
**States**: default, hover, active, disabled, loading

**Visual Specs**:
- Primary: bg-primary-600, text-white, hover:bg-primary-700
- Height: sm=32px, md=40px, lg=48px
- Padding: sm=12px, md=16px, lg=20px
- Border radius: 6px
- Font weight: 500
- Transition: all 150ms ease

**Loading State**: Spinner + "Loading..." text

### 2. Input Fields

**Text Input**
```tsx
<Input
  label="Building Name"
  placeholder="Enter building name"
  error="This field is required"
  helperText="Official strata name"
/>
```

**Visual Specs**:
- Height: 40px
- Padding: 12px 16px
- Border: 1px solid slate-200
- Focus: border-primary-500, shadow-focus
- Error: border-error-500
- Font size: 16px (prevents iOS zoom)
- Border radius: 6px

**Types**: text, email, password, number, tel, url, search, textarea

### 3. Cards

**Standard Card**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Maintenance Requests</CardTitle>
    <CardDescription>Track and manage issues</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    <Button>View All</Button>
  </CardFooter>
</Card>
```

**Visual Specs**:
- Background: white
- Border: 1px solid slate-200
- Border radius: 8px
- Padding: 24px
- Shadow: shadow-sm
- Hover: shadow-md (transition 200ms)

### 4. Status Badges

**Priority Badges**
```tsx
<Badge variant="urgent">Urgent</Badge>
<Badge variant="high">High</Badge>
<Badge variant="medium">Medium</Badge>
<Badge variant="low">Low</Badge>
```

**Visual Specs**:
- Height: 24px
- Padding: 4px 12px
- Border radius: 12px (pill)
- Font size: 12px
- Font weight: 500

**Colors**:
- Urgent: bg-error-100, text-error-700, border-error-200
- High: bg-warning-100, text-warning-700
- Medium: bg-primary-100, text-primary-700
- Low: bg-slate-100, text-slate-700

### 5. Avatars

**User Avatar**
```tsx
<Avatar
  src="/avatars/john.jpg"
  fallback="JD"
  size="md"
  status="online"
/>
```

**Sizes**: xs=24px, sm=32px, md=40px, lg=48px, xl=64px
**Status Indicator**: online (green), away (yellow), offline (gray)
**Fallback**: Initials with generated background color

### 6. Data Tables

**Maintenance Requests Table**
```tsx
<DataTable
  columns={columns}
  data={maintenanceRequests}
  searchable
  filterable
  sortable
  pagination
/>
```

**Features**:
- Column sorting (asc/desc)
- Global search
- Column filters
- Row selection
- Pagination (10, 25, 50, 100)
- Export to CSV
- Responsive (cards on mobile)

**Visual Specs**:
- Header: bg-slate-50, font-weight-600
- Rows: hover:bg-slate-50
- Borders: 1px solid slate-200
- Padding: 12px 16px
- Font size: 14px

### 7. Modals

**Confirmation Modal**
```tsx
<Modal
  title="Delete Request?"
  description="This action cannot be undone."
  open={isOpen}
  onClose={handleClose}
>
  <ModalFooter>
    <Button variant="outline" onClick={handleClose}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  </ModalFooter>
</Modal>
```

**Visual Specs**:
- Max width: 500px
- Padding: 24px
- Border radius: 12px
- Backdrop: bg-black/50, backdrop-blur-sm
- Animation: fade + scale (200ms)
- Close on ESC key
- Focus trap

### 8. Toast Notifications

**Success Toast**
```tsx
toast.success("Maintenance request created!")
toast.error("Failed to upload document")
toast.loading("Uploading...")
```

**Visual Specs**:
- Position: top-right
- Width: 350px
- Padding: 16px
- Border radius: 8px
- Shadow: shadow-lg
- Auto-dismiss: 5 seconds
- Swipe to dismiss
- Icon + message + close button

### 9. Empty States

**No Data Empty State**
```tsx
<EmptyState
  icon={<Wrench />}
  title="No maintenance requests"
  description="Create your first request to get started"
  action={
    <Button onClick={handleCreate}>
      Create Request
    </Button>
  }
/>
```

**Visual Specs**:
- Centered layout
- Icon: 64px, text-slate-400
- Title: text-xl, font-semibold
- Description: text-slate-600
- Illustration: Optional (Undraw)

### 10. Loading Skeletons

**Card Skeleton**
```tsx
<Skeleton className="h-32 w-full" />
<Skeleton className="h-4 w-3/4" />
<Skeleton className="h-4 w-1/2" />
```

**Visual Specs**:
- Background: slate-200
- Animation: shimmer (1.5s infinite)
- Border radius: matches content
- Pulse effect

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
--screen-sm: 640px;   /* Tablet */
--screen-md: 768px;   /* Small laptop */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
--screen-2xl: 1536px; /* Ultra-wide */
```

**Layout Strategy**:
- Mobile (< 640px): Single column, bottom nav
- Tablet (640-1024px): Two columns, side nav
- Desktop (> 1024px): Three columns, expanded sidebar

---

## 🎭 Animation Guidelines

### Timing Functions

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Duration Scale

```css
--duration-fast: 100ms;    /* Hover, focus */
--duration-normal: 200ms;  /* Transitions */
--duration-slow: 300ms;    /* Modals, drawers */
--duration-slower: 500ms;  /* Page transitions */
```

### Animation Patterns

**Hover Effects**
- Buttons: Scale 1.02, shadow increase
- Cards: Lift (translateY -2px), shadow increase
- Links: Color change, underline

**Page Transitions**
- Enter: Fade in + slide up 20px (200ms)
- Exit: Fade out (150ms)

**List Items**
- Stagger: 50ms delay per item
- Enter: Fade + slide from left

**Success Actions**
- Checkmark: Scale from 0 to 1 with bounce
- Confetti: On major completions (onboarding)

**Loading States**
- Spinner: Rotate 360deg (1s infinite)
- Progress bar: Indeterminate animation
- Skeleton: Shimmer left to right

---

## 🎨 Page Layouts

### 1. Dashboard (Overview)

```
┌─────────────────────────────────────────────────┐
│ Header: Logo | Building ▼ | Search | 🔔 | 👤   │
├──────┬──────────────────────────────────────────┤
│      │ Welcome back, John! 👋                   │
│      │                                           │
│ Side │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────┐│
│ bar  │ │ 🔧 12  │ │ 📢 5   │ │ 💰 $12K│ │📅  ││
│      │ │ Open   │ │ New    │ │ Balance│ │AGM ││
│ Nav  │ └────────┘ └────────┘ └────────┘ └────┘│
│      │                                           │
│ 📊   │ Recent Activity                          │
│ 🏢   │ ┌─────────────────────────────────────┐ │
│ 🔧   │ │ 🔴 Urgent: Leaking pipe Unit 402    │ │
│ 📢   │ │ 2 hours ago • Assigned to ABC Plumb │ │
│ 📄   │ └─────────────────────────────────────┘ │
│ 💰   │ ┌─────────────────────────────────────┐ │
│ 👥   │ │ 📢 New announcement posted          │ │
│      │ │ 5 hours ago • Window cleaning       │ │
│      │ └─────────────────────────────────────┘ │
│      │                                           │
│      │ Quick Actions                            │
│      │ [🔧 Report Issue] [💰 Pay Levy]         │
└──────┴──────────────────────────────────────────┘
```

### 2. Maintenance List

```
┌─────────────────────────────────────────────────┐
│ Maintenance Requests          [+ New Request]   │
├─────────────────────────────────────────────────┤
│ [Search...] [Filter ▼] [Sort ▼] [View: 📋 📊] │
├─────────────────────────────────────────────────┤
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │ 🔴 URGENT  #MR-1234  2h ago              │   │
│ │ Leaking Pipe in Unit 402                 │   │
│ │ [📷] [📷] [📷]                            │   │
│ │ 📍 Floor 4 • 👤 John Doe • ⏳ In Progress│   │
│ │ [View Details →]                         │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │ 🟡 HIGH  #MR-1233  1d ago                │   │
│ │ Broken Elevator Button                   │   │
│ │ 📍 Lobby • 👤 Jane Smith • ✅ Resolved   │   │
│ │ [View Details →]                         │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
│ [Load More...]                                  │
└─────────────────────────────────────────────────┘
```

### 3. Maintenance Detail

```
┌─────────────────────────────────────────────────┐
│ ← Back to Requests                              │
├─────────────────────────────────────────────────┤
│ 🔴 URGENT  #MR-1234                             │
│ Leaking Pipe in Unit 402                        │
│                                                  │
│ Status: ⏳ In Progress  [Update Status ▼]      │
│                                                  │
│ ┌─────────────────────────────────────────┐    │
│ │ [Photo Gallery - 3 images]              │    │
│ │ [📷 Large preview]                       │    │
│ │ [📷] [📷] [📷] thumbnails                │    │
│ └─────────────────────────────────────────┘    │
│                                                  │
│ Description                                     │
│ Water leaking from ceiling in bathroom...      │
│                                                  │
│ Details                                         │
│ 📍 Location: Floor 4, Unit 402                 │
│ 👤 Submitted by: John Doe                      │
│ 📅 Created: 2 hours ago                        │
│ 🔧 Assigned to: ABC Plumbing                   │
│ ⚡ Priority: Urgent                            │
│ 📂 Category: Plumbing                          │
│                                                  │
│ Timeline                                        │
│ ● Submitted - 2h ago                           │
│ ● Reviewed - 1h ago                            │
│ ● In Progress - 30m ago                        │
│ ○ Resolved                                     │
│ ○ Closed                                       │
│                                                  │
│ Comments (3)                                    │
│ ┌─────────────────────────────────────────┐    │
│ │ 👤 Building Manager • 1h ago            │    │
│ │ Plumber has been contacted and will...  │    │
│ └─────────────────────────────────────────┘    │
│                                                  │
│ [Add Comment...]                                │
└─────────────────────────────────────────────────┘
```

### 4. Create Maintenance Request

```
┌─────────────────────────────────────────────────┐
│ Create Maintenance Request                      │
├─────────────────────────────────────────────────┤
│                                                  │
│ Title *                                         │
│ [Enter a brief description...]                  │
│                                                  │
│ Category *                                      │
│ [🔧 Plumbing ▼]                                │
│                                                  │
│ Priority *                                      │
│ ○ Low  ○ Medium  ● High  ○ Urgent              │
│                                                  │
│ Location                                        │
│ Floor: [4 ▼]  Unit: [402 ▼]                   │
│                                                  │
│ Description *                                   │
│ [Detailed description of the issue...]          │
│ │                                               │
│ │                                               │
│ └───────────────────────────────────────────    │
│                                                  │
│ Photos                                          │
│ ┌─────────────────────────────────────────┐    │
│ │  📷 Drag & drop photos here             │    │
│ │     or click to browse                   │    │
│ │                                          │    │
│ │  [📷] [📷] [📷] (3 uploaded)            │    │
│ └─────────────────────────────────────────┘    │
│                                                  │
│ [Cancel]                    [Create Request]    │
└─────────────────────────────────────────────────┘
```

---

## 🎨 Iconography

**Icon Library**: Lucide React (consistent, modern, 24px base)

**Common Icons**:
- Maintenance: Wrench, Tool, AlertTriangle
- Announcements: Megaphone, Bell, MessageSquare
- Documents: FileText, Folder, Download
- Finance: DollarSign, CreditCard, TrendingUp
- Building: Building, Home, MapPin
- Users: User, Users, UserPlus
- Actions: Plus, Edit, Trash, Check, X
- Navigation: ChevronRight, ChevronDown, Menu
- Status: Clock, CheckCircle, XCircle, AlertCircle

**Usage**:
- Size: 16px (inline), 20px (buttons), 24px (headers)
- Color: Inherit from parent or semantic color
- Stroke width: 2px (default)

---

## 🌈 Dark Mode (Phase 2)

**Color Adjustments**:
```css
/* Dark Mode Palette */
--dark-bg: #0F172A;
--dark-surface: #1E293B;
--dark-border: #334155;
--dark-text: #F1F5F9;
--dark-text-secondary: #94A3B8;
```

**Implementation**:
- Use CSS variables
- Toggle via user preference
- Persist in localStorage
- System preference detection

---

## ♿ Accessibility Standards

**WCAG 2.1 AA Compliance**:
- Color contrast: 4.5:1 (text), 3:1 (UI)
- Keyboard navigation: All interactive elements
- Focus indicators: Visible on all focusable elements
- ARIA labels: On all icons and buttons
- Screen reader: Semantic HTML, proper headings
- Form labels: Associated with inputs
- Error messages: Clear, actionable

**Testing Tools**:
- axe DevTools
- Lighthouse accessibility audit
- Screen reader testing (NVDA, VoiceOver)

---

## 📐 Grid System

**Container Widths**:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

**Column Grid**: 12 columns
**Gutter**: 24px (desktop), 16px (mobile)

---

## 🎯 Design Checklist (Per Feature)

- [ ] Mobile responsive (320px+)
- [ ] Tablet optimized (768px+)
- [ ] Desktop layout (1024px+)
- [ ] Loading states designed
- [ ] Error states designed
- [ ] Empty states designed
- [ ] Success states designed
- [ ] Hover states defined
- [ ] Focus states visible
- [ ] Active states clear
- [ ] Disabled states obvious
- [ ] Animations smooth (60fps)
- [ ] Color contrast passes WCAG AA
- [ ] Keyboard navigable
- [ ] Screen reader friendly
- [ ] Touch targets 44x44px+
- [ ] Forms have validation
- [ ] Errors are actionable
- [ ] Icons have labels
- [ ] Images have alt text

---

**This design system ensures consistency, speed, and beauty across the entire platform. Every component is production-ready and accessible.** 🎨✨
