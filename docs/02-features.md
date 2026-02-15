# StrataHub — Features & Product Specification

## Feature Overview

StrataHub is organised into **6 core modules**, each solving a key pain point in strata management.

---

## Module 1: 🏢 Building & Community Hub

The central dashboard for each strata scheme.

### Features

| Feature | Description | Priority |
|---|---|---|
| **Building Profile** | Address, photos, key info, insurance details, by-laws | P0 — MVP |
| **Resident Directory** | Searchable list of all owners/tenants, with contact preferences | P0 — MVP |
| **Unit Registry** | Every lot/unit with owner details, tenant info, entitlements | P0 — MVP |
| **Noticeboard** | Announcements from committee/manager, pinned notices | P0 — MVP |
| **Community Feed** | Social-style feed for building updates, events, lost & found | P1 |
| **Amenity Booking** | Book BBQ areas, gyms, meeting rooms, parking spaces | P1 |
| **Key Contacts** | Emergency contacts, building manager, plumber, electrician | P0 — MVP |
| **Move-in/Move-out Requests** | Schedule elevator bookings for moving | P2 |

### User Stories
- *As an owner, I want to see who lives in my building and their contact info so I can reach out about shared issues.*
- *As a committee member, I want to post announcements that all residents can see immediately.*
- *As a tenant, I want to book the rooftop BBQ area for Saturday.*

---

## Module 2: 🔧 Maintenance & Work Orders

Track, manage, and resolve maintenance issues across the building.

### Features

| Feature | Description | Priority |
|---|---|---|
| **Submit Request** | Photo upload, category selection, urgency level, location in building | P0 — MVP |
| **Track Status** | Real-time status updates: Submitted → Reviewed → In Progress → Resolved | P0 — MVP |
| **AI Categorisation** | Auto-categorise requests (plumbing, electrical, structural, cosmetic) | P2 |
| **Contractor Assignment** | Assign to preferred contractor, send work order | P1 |
| **Quote Management** | Request and compare quotes from multiple contractors | P1 |
| **Work Order History** | Full audit trail of all maintenance for the building | P0 — MVP |
| **Recurring Maintenance** | Schedule routine maintenance (fire safety, lift servicing, cleaning) | P1 |
| **Photo Evidence** | Before/after photos attached to each work order | P0 — MVP |
| **Push Notifications** | Notify relevant parties when status changes | P1 |

### User Stories
- *As a resident, I want to report a leaking tap in the common area with a photo so the manager can act quickly.*
- *As a strata manager, I want to assign a plumber to a job and track their progress.*
- *As a committee member, I want to see all maintenance spend for the quarter.*

---

## Module 3: 💰 Financial Management

Transparent, real-time financial visibility for every stakeholder.

### Features

| Feature | Description | Priority |
|---|---|---|
| **Financial Dashboard** | Overview of admin fund, capital works fund, balances, trends | P0 |
| **Levy Management** | Set levies per lot, generate levy notices, track payments | P0 |
| **Payment Gateway** | Pay levies online via card, BPAY, or direct debit | P0 |
| **Arrears Tracking** | Identify overdue levies, automated reminders, escalation paths | P0 |
| **Expense Tracking** | Log all building expenses, categorise, receipt upload | P1 |
| **Budget Planning** | Annual budget creation, comparison actual vs budget | P1 |
| **Sinking Fund Forecast** | 10-year capital works plan with projections | P2 |
| **Xero/MYOB Integration** | Sync financial data with popular accounting software | P1 |
| **Financial Reports** | Generate P&L, balance sheet, levy schedule, arrears report | P0 |
| **Audit Trail** | Complete log of all financial transactions | P0 |

### User Stories
- *As an owner, I want to see my levy balance and pay online instantly.*
- *As a strata manager, I want to generate a financial report for the AGM in 2 clicks.*
- *As a committee treasurer, I want to compare this year's spending against the budget.*

---

## Module 4: 🗳️ Governance & Voting

Digital-first governance for strata meetings and decisions.

### Features

| Feature | Description | Priority |
|---|---|---|
| **Meeting Scheduler** | Create AGM/EGM/Committee meetings with agenda | P1 |
| **Motion Creation** | Draft motions with supporting documents | P1 |
| **Digital Voting** | Secure online voting with identity verification | P1 |
| **Proxy Management** | Digital proxy forms, proxy holder assignment | P1 |
| **Quorum Tracking** | Real-time quorum calculation during meetings | P2 |
| **Meeting Minutes** | Auto-generate minutes from agenda + voting results | P2 |
| **Resolution Register** | Searchable history of all passed motions/resolutions | P1 |
| **By-Law Management** | View, amend, and track building by-laws | P1 |

### User Stories
- *As an owner who travels frequently, I want to vote on motions remotely.*
- *As a secretary, I want to create an AGM agenda and distribute it to all owners digitally.*
- *As a committee member, I want to see the history of all past resolutions.*

---

## Module 5: 📄 Document Management

Centralised, searchable repository for all building documents.

### Features

| Feature | Description | Priority |
|---|---|---|
| **Document Library** | Organised folders: Insurance, Minutes, Financial, Compliance, By-Laws | P0 — MVP |
| **Upload & Versioning** | Upload documents with version history | P0 — MVP |
| **Search** | Full-text search across all documents | P1 |
| **Access Control** | Different access levels: Owner, Tenant, Committee, Manager | P0 — MVP |
| **Auto-Filing** | AI auto-categorise uploaded documents | P2 |
| **Expiry Alerts** | Notify when insurance, compliance certs are expiring | P1 |
| **Section 184 Certificates** | Generate and manage strata information certificates (NSW) | P2 |

### User Stories
- *As a prospective buyer, I want to access the building's strata reports before purchasing.*
- *As a strata manager, I want to be notified 30 days before the building insurance expires.*
- *As an owner, I want to find the minutes from last year's AGM quickly.*

---

## Module 6: 💬 Communication

Unified communication replacing fragmented email chains and notice boards.

### Features

| Feature | Description | Priority |
|---|---|---|
| **Announcements** | Broadcast messages to all or specific groups | P0 — MVP |
| **Direct Messages** | Private messaging between users | P1 |
| **Discussion Threads** | Topic-based discussions (like Slack channels) | P1 |
| **Push Notifications** | Mobile + email notifications for important updates | P1 |
| **Email Digest** | Weekly summary email for less active users | P2 |
| **Polls & Surveys** | Quick community polls (not formal voting) | P2 |
| **Multi-language** | Support for key languages in AU (English, Mandarin, Arabic, Vietnamese) | P2 |
| **Noise/Issue Reporting** | Anonymous noise complaints with time logging | P2 |

### User Stories
- *As a building manager, I want to notify all residents about a water shutdown tomorrow.*
- *As a resident, I want to discuss the proposed garden renovation with my neighbours.*
- *As a tenant who speaks Mandarin, I want to read announcements in my language.*

---

## Non-Functional Requirements

| Requirement | Target |
|---|---|
| **Performance** | Page load < 2 seconds, API response < 500ms |
| **Availability** | 99.9% uptime SLA |
| **Security** | SOC 2 Type II, encryption at rest & in transit, MFA |
| **Data Residency** | All data hosted in Australia (AWS Sydney ap-southeast-2) |
| **Scalability** | Support 10,000+ buildings, 100K+ users |
| **Accessibility** | WCAG 2.1 AA compliance |
| **Mobile** | Responsive web (MVP), native iOS/Android (Phase 4) |
| **Compliance** | GDPR-equivalent Australian Privacy Act compliance |
| **Backup** | Daily automated backups, 30-day retention, disaster recovery |
