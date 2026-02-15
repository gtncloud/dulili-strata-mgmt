# StrataHub — Component Showcase
## Visual Reference for UI Implementation

---

## 🎨 Purpose

This document provides visual ASCII mockups and code examples for every major component in StrataHub. Use this as a reference when building the UI.

---

## 1. Dashboard Cards

### Stats Card
```
┌─────────────────────────────────┐
│ 🔧                         ↗️   │
│ Maintenance Requests            │
│                                 │
│ 12                              │
│ Open requests                   │
│                                 │
│ +3 from last week               │
└─────────────────────────────────┘
```

**Code**:
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium">
      Maintenance Requests
    </CardTitle>
    <Wrench className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">12</div>
    <p className="text-xs text-muted-foreground">
      Open requests
    </p>
    <p className="text-xs text-emerald-600 mt-1">
      +3 from last week
    </p>
  </CardContent>
</Card>
```

---

## 2. Maintenance Request Card

### List View Card
```
┌──────────────────────────────────────────────────┐
│ 🔴 URGENT  #MR-1234                    2h ago    │
│                                                  │
│ Leaking Pipe in Unit 402                        │
│ Water leaking from ceiling in bathroom...       │
│                                                  │
│ [📷] [📷] [📷]                                   │
│                                                  │
│ 📍 Floor 4, Unit 402                            │
│ 👤 John Doe  •  🔧 ABC Plumbing                 │
│                                                  │
│ Status: ⏳ In Progress                          │
│                                                  │
│ ────────────────────────────────────────────    │
│ [View Details →]                                │
└──────────────────────────────────────────────────┘
```

**Code**:
```tsx
<Card className="hover:shadow-md transition-shadow">
  <CardHeader>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Badge variant="urgent">URGENT</Badge>
        <span className="text-sm text-muted-foreground">#MR-1234</span>
      </div>
      <span className="text-xs text-muted-foreground">2h ago</span>
    </div>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <h3 className="font-semibold text-lg">Leaking Pipe in Unit 402</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Water leaking from ceiling in bathroom...
      </p>
    </div>

    <div className="flex gap-2">
      {photos.map((photo) => (
        <img
          key={photo.id}
          src={photo.url}
          alt="Maintenance photo"
          className="w-20 h-20 object-cover rounded-md"
        />
      ))}
    </div>

    <div className="space-y-1 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>Floor 4, Unit 402</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <User className="h-4 w-4" />
        <span>John Doe</span>
        <span>•</span>
        <Wrench className="h-4 w-4" />
        <span>ABC Plumbing</span>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Status:</span>
      <Badge variant="warning">In Progress</Badge>
    </div>
  </CardContent>
  <CardFooter>
    <Button variant="ghost" className="w-full">
      View Details →
    </Button>
  </CardFooter>
</Card>
```

---

## 3. Status Timeline

### Vertical Timeline
```
┌─────────────────────────────────┐
│ Timeline                        │
│                                 │
│ ● Submitted                     │
│ │ 2 hours ago                   │
│ │ by John Doe                   │
│ │                               │
│ ● Reviewed                      │
│ │ 1 hour ago                    │
│ │ by Building Manager           │
│ │                               │
│ ● In Progress                   │
│ │ 30 minutes ago                │
│ │ Assigned to ABC Plumbing      │
│ │                               │
│ ○ Resolved                      │
│ │ Pending                       │
│ │                               │
│ ○ Closed                        │
│   Pending                       │
└─────────────────────────────────┘
```

**Code**:
```tsx
<div className="space-y-4">
  <h3 className="font-semibold">Timeline</h3>
  <div className="space-y-6">
    {timeline.map((event, index) => (
      <div key={event.id} className="flex gap-4">
        <div className="flex flex-col items-center">
          <div
            className={`
              w-3 h-3 rounded-full
              ${event.completed ? 'bg-primary-600' : 'bg-slate-300'}
            `}
          />
          {index < timeline.length - 1 && (
            <div className="w-0.5 h-full bg-slate-200 mt-1" />
          )}
        </div>
        <div className="flex-1 pb-6">
          <p className="font-medium">{event.status}</p>
          <p className="text-sm text-muted-foreground">{event.time}</p>
          <p className="text-sm text-muted-foreground">{event.actor}</p>
        </div>
      </div>
    ))}
  </div>
</div>
```

---

## 4. File Upload Zone

### Drag & Drop Area
```
┌─────────────────────────────────────────────┐
│                                             │
│              📷                             │
│                                             │
│     Drag & drop photos here                 │
│     or click to browse                      │
│                                             │
│     Max 5 files • PNG, JPG, WebP            │
│                                             │
└─────────────────────────────────────────────┘

After upload:
┌─────────────────────────────────────────────┐
│ [📷 image1.jpg]                        [×]  │
│ [📷 image2.jpg]                        [×]  │
│ [📷 image3.jpg]                        [×]  │
│                                             │
│ [Upload 3 files]                            │
└─────────────────────────────────────────────┘
```

**Code**:
```tsx
<div
  {...getRootProps()}
  className={`
    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
    transition-colors
    ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-300'}
  `}
>
  <input {...getInputProps()} />
  <Upload className="mx-auto h-12 w-12 text-slate-400" />
  <p className="mt-2 text-sm text-slate-600">
    Drag & drop photos here, or click to browse
  </p>
  <p className="text-xs text-slate-500 mt-1">
    Max 5 files • PNG, JPG, WebP
  </p>
</div>

{files.length > 0 && (
  <div className="space-y-2 mt-4">
    {files.map((file, index) => (
      <div
        key={index}
        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
      >
        <div className="flex items-center gap-2">
          <Image className="h-4 w-4 text-slate-400" />
          <span className="text-sm">{file.name}</span>
        </div>
        <button onClick={() => removeFile(index)}>
          <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
        </button>
      </div>
    ))}
    <Button onClick={handleUpload} className="w-full">
      Upload {files.length} files
    </Button>
  </div>
)}
```

---

## 5. Announcement Card

### Feed Item
```
┌──────────────────────────────────────────────────┐
│ 📌 PINNED                                        │
│                                                  │
│ [Hero Image - Window Cleaning]                  │
│                                                  │
│ Window Cleaning - Tuesday 15th                   │
│ Posted by Building Manager • 3 days ago          │
│                                                  │
│ The window cleaning team will be visiting       │
│ the building on Tuesday, March 15th between      │
│ 9am and 5pm. Please ensure balcony doors...     │
│                                                  │
│ 👍 12  💬 3 comments                            │
│                                                  │
│ ────────────────────────────────────────────    │
│ [Read More] [Comment]                            │
└──────────────────────────────────────────────────┘
```

**Code**:
```tsx
<Card className="overflow-hidden">
  {announcement.isPinned && (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
      <div className="flex items-center gap-2 text-amber-700">
        <Pin className="h-4 w-4" />
        <span className="text-sm font-medium">PINNED</span>
      </div>
    </div>
  )}

  {announcement.imageUrl && (
    <img
      src={announcement.imageUrl}
      alt={announcement.title}
      className="w-full h-48 object-cover"
    />
  )}

  <CardHeader>
    <CardTitle>{announcement.title}</CardTitle>
    <CardDescription>
      Posted by {announcement.author.name} • {formatDate(announcement.publishedAt)}
    </CardDescription>
  </CardHeader>

  <CardContent>
    <p className="text-sm text-muted-foreground line-clamp-3">
      {announcement.content}
    </p>

    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
      <button className="flex items-center gap-1 hover:text-primary-600">
        <ThumbsUp className="h-4 w-4" />
        <span>12</span>
      </button>
      <button className="flex items-center gap-1 hover:text-primary-600">
        <MessageSquare className="h-4 w-4" />
        <span>3 comments</span>
      </button>
    </div>
  </CardContent>

  <CardFooter className="gap-2">
    <Button variant="outline" className="flex-1">
      Read More
    </Button>
    <Button variant="ghost" className="flex-1">
      Comment
    </Button>
  </CardFooter>
</Card>
```

---

## 6. Data Table

### Maintenance Requests Table
```
┌────────────────────────────────────────────────────────────────┐
│ [Search...]  [Filter ▼]  [Sort ▼]              [Export CSV]   │
├────────────────────────────────────────────────────────────────┤
│ ID      │ Title              │ Status      │ Priority │ Date  │
├─────────┼────────────────────┼─────────────┼──────────┼───────┤
│ #MR-123 │ Leaking pipe       │ In Progress │ 🔴 Urgent│ 2h ago│
│ #MR-122 │ Broken elevator    │ Resolved    │ 🟡 High  │ 1d ago│
│ #MR-121 │ Light not working  │ Submitted   │ 🟢 Low   │ 2d ago│
├─────────┴────────────────────┴─────────────┴──────────┴───────┤
│ Showing 1-3 of 45  [< 1 2 3 4 5 >]                            │
└────────────────────────────────────────────────────────────────┘
```

**Code**:
```tsx
<div className="space-y-4">
  <div className="flex items-center gap-2">
    <Input
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="max-w-sm"
    />
    <Select value={filter} onValueChange={setFilter}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="urgent">Urgent</SelectItem>
        <SelectItem value="high">High</SelectItem>
      </SelectContent>
    </Select>
    <Button variant="outline" className="ml-auto">
      Export CSV
    </Button>
  </div>

  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="font-mono text-sm">
              #{request.id}
            </TableCell>
            <TableCell>{request.title}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(request.status)}>
                {request.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={getPriorityVariant(request.priority)}>
                {request.priority}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(request.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>

  <div className="flex items-center justify-between">
    <p className="text-sm text-muted-foreground">
      Showing 1-3 of 45
    </p>
    <div className="flex gap-1">
      <Button variant="outline" size="sm">Previous</Button>
      <Button variant="outline" size="sm">1</Button>
      <Button variant="default" size="sm">2</Button>
      <Button variant="outline" size="sm">3</Button>
      <Button variant="outline" size="sm">Next</Button>
    </div>
  </div>
</div>
```

---

## 7. Empty States

### No Data Yet
```
┌─────────────────────────────────┐
│                                 │
│           🔧                    │
│                                 │
│   No maintenance requests       │
│   Create your first request     │
│   to get started                │
│                                 │
│   [+ Create Request]            │
│                                 │
└─────────────────────────────────┘
```

**Code**:
```tsx
<div className="flex flex-col items-center justify-center py-12 px-4">
  <div className="rounded-full bg-slate-100 p-6 mb-4">
    <Wrench className="h-12 w-12 text-slate-400" />
  </div>
  <h3 className="text-lg font-semibold mb-2">
    No maintenance requests
  </h3>
  <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
    Create your first request to get started tracking maintenance issues
  </p>
  <Button onClick={handleCreate}>
    <Plus className="mr-2 h-4 w-4" />
    Create Request
  </Button>
</div>
```

---

## 8. Loading Skeletons

### Card Skeleton
```
┌─────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│                                 │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│                                 │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│                                 │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└─────────────────────────────────┘
```

**Code**:
```tsx
<Card>
  <CardHeader>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2 mt-2" />
  </CardHeader>
  <CardContent className="space-y-3">
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </CardContent>
  <CardFooter>
    <Skeleton className="h-10 w-full" />
  </CardFooter>
</Card>
```

---

## 9. Toast Notifications

### Success Toast
```
┌─────────────────────────────────┐
│ ✓  Maintenance request created! │
│    View request →               │
└─────────────────────────────────┘
```

**Code**:
```tsx
import { toast } from "sonner"

// Success
toast.success("Maintenance request created!", {
  description: "View request",
  action: {
    label: "View",
    onClick: () => router.push(`/maintenance/${id}`),
  },
})

// Error
toast.error("Failed to upload document", {
  description: "Please try again",
})

// Loading
toast.loading("Uploading files...")

// Promise
toast.promise(uploadFiles(), {
  loading: "Uploading...",
  success: "Files uploaded successfully!",
  error: "Upload failed",
})
```

---

## 10. Modal Dialog

### Confirmation Modal
```
┌─────────────────────────────────┐
│ Delete Request?            [×]  │
├─────────────────────────────────┤
│                                 │
│ Are you sure you want to delete │
│ this maintenance request? This  │
│ action cannot be undone.        │
│                                 │
│ [Cancel]  [Delete]              │
└─────────────────────────────────┘
```

**Code**:
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete Request?</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this maintenance request?
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 11. Form with Validation

### Create Request Form
```
┌─────────────────────────────────┐
│ Create Maintenance Request      │
├─────────────────────────────────┤
│                                 │
│ Title *                         │
│ [Enter a brief description...] │
│ ⚠️ Title must be at least 5    │
│    characters                   │
│                                 │
│ Category *                      │
│ [🔧 Plumbing ▼]                │
│                                 │
│ Priority *                      │
│ ○ Low  ○ Medium  ● High  ○ Urgent│
│                                 │
│ Description *                   │
│ [Detailed description...]       │
│ │                               │
│ │                               │
│ └───────────────────────────    │
│                                 │
│ [Cancel]  [Create Request]      │
└─────────────────────────────────┘
```

**Code**:
```tsx
<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="title">Title *</Label>
    <Input
      id="title"
      {...register("title")}
      placeholder="Enter a brief description..."
    />
    {errors.title && (
      <p className="text-sm text-error-500 flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        {errors.title.message}
      </p>
    )}
  </div>

  <div className="space-y-2">
    <Label htmlFor="category">Category *</Label>
    <Select onValueChange={(value) => setValue("category", value)}>
      <SelectTrigger>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="plumbing">🔧 Plumbing</SelectItem>
        <SelectItem value="electrical">⚡ Electrical</SelectItem>
        <SelectItem value="structural">🏗️ Structural</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <div className="space-y-2">
    <Label>Priority *</Label>
    <RadioGroup onValueChange={(value) => setValue("priority", value)}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="low" id="low" />
        <Label htmlFor="low">Low</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="medium" id="medium" />
        <Label htmlFor="medium">Medium</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="high" id="high" />
        <Label htmlFor="high">High</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="urgent" id="urgent" />
        <Label htmlFor="urgent">Urgent</Label>
      </div>
    </RadioGroup>
  </div>

  <div className="space-y-2">
    <Label htmlFor="description">Description *</Label>
    <Textarea
      id="description"
      {...register("description")}
      rows={4}
      placeholder="Detailed description of the issue..."
    />
  </div>

  <div className="flex gap-2">
    <Button type="button" variant="outline" onClick={onCancel}>
      Cancel
    </Button>
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Creating..." : "Create Request"}
    </Button>
  </div>
</form>
```

---

## 12. Command Palette (Cmd+K)

### Quick Actions
```
┌─────────────────────────────────┐
│ [🔍 Search...]                  │
├─────────────────────────────────┤
│ Quick Actions                   │
│ > Create maintenance request    │
│ > Post announcement             │
│ > Upload document               │
│                                 │
│ Navigation                      │
│ > Go to Dashboard               │
│ > Go to Maintenance             │
│ > Go to Announcements           │
└─────────────────────────────────┘
```

**Code**:
```tsx
import { Command } from "cmdk"

<Command.Dialog open={open} onOpenChange={setOpen}>
  <Command.Input placeholder="Search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>

    <Command.Group heading="Quick Actions">
      <Command.Item onSelect={() => router.push("/maintenance/new")}>
        <Plus className="mr-2 h-4 w-4" />
        Create maintenance request
      </Command.Item>
      <Command.Item onSelect={() => router.push("/announcements/new")}>
        <Megaphone className="mr-2 h-4 w-4" />
        Post announcement
      </Command.Item>
    </Command.Group>

    <Command.Group heading="Navigation">
      <Command.Item onSelect={() => router.push("/dashboard")}>
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Go to Dashboard
      </Command.Item>
      <Command.Item onSelect={() => router.push("/maintenance")}>
        <Wrench className="mr-2 h-4 w-4" />
        Go to Maintenance
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command.Dialog>
```

---

## 🎨 Animation Examples

### Fade In + Slide Up
```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>
```

### Stagger Children
```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Scale on Hover
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15 }}
>
  Click me
</motion.button>
```

---

## 📱 Mobile Adaptations

### Desktop → Mobile Transformations

**Desktop: Sidebar Navigation**
```
┌─────┬──────────────┐
│ Nav │   Content    │
│     │              │
│ 📊  │              │
│ 🏢  │              │
│ 🔧  │              │
└─────┴──────────────┘
```

**Mobile: Bottom Tab Bar**
```
┌──────────────────────┐
│                      │
│      Content         │
│                      │
│                      │
├──────────────────────┤
│ 📊  🏢  🔧  📢  👤  │
└──────────────────────┘
```

**Code**:
```tsx
// Desktop
<div className="hidden md:flex">
  <Sidebar />
</div>

// Mobile
<div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white">
  <nav className="flex justify-around py-2">
    <Link href="/dashboard">
      <LayoutDashboard className="h-6 w-6" />
    </Link>
    <Link href="/maintenance">
      <Wrench className="h-6 w-6" />
    </Link>
    {/* ... */}
  </nav>
</div>
```

---

## ✅ Component Checklist

When building each component, ensure:

- [ ] Responsive (mobile, tablet, desktop)
- [ ] Loading state implemented
- [ ] Error state handled
- [ ] Empty state designed
- [ ] Hover states defined
- [ ] Focus states visible
- [ ] Keyboard accessible
- [ ] Screen reader friendly
- [ ] Animations smooth (60fps)
- [ ] Colors pass WCAG AA
- [ ] Touch targets 44x44px+

---

**Use this showcase as your visual reference when implementing the UI. Copy, adapt, and improve!** 🎨
