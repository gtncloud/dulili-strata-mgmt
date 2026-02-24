# Fire Safety & Debt Recovery - Australian Compliance Research

**Date:** February 16, 2026  
**Purpose:** Research-based implementation plan for Fire Safety Compliance and Debt Recovery modules

---

## Part 1: Fire Safety Compliance Requirements

### Legal Framework

**Primary Legislation:**
- Environmental Planning and Assessment (Development Certification and Fire Safety) Regulation 2021
- NSW Strata Schemes Management Act 2015
- Australian Standard AS1851-2012 (Routine service of fire protection systems)

**Key Requirements:**

1. **Annual Fire Safety Statement (AFSS)**
   - Must be issued annually by building owners/Owners Corporation
   - Must be submitted to Local Council and Fire and Rescue NSW
   - Must be endorsed by Accredited Practitioner (Fire Safety) from July 1, 2020
   - Must be displayed prominently in the building
   - Due on anniversary of Fire Safety Certificate or building occupation

2. **Fire Safety Schedule**
   - Lists all required fire safety measures
   - Specifies standards each measure must achieve
   - Issued by councils or accredited certifiers

3. **AS1851-2012 Compliance** (Effective February 13, 2026)
   - All Class 1b and Class 2-9 buildings must comply
   - Mandatory maintenance procedures for fire safety systems
   - Regular testing and maintenance required

4. **Essential Fire Safety Measures**
   - Fire detection and alarm systems
   - Emergency warning systems
   - Fire suppression systems (sprinklers, hydrants)
   - Emergency lighting and exit signs
   - Fire doors and smoke doors
   - Fire extinguishers and hose reels
   - Evacuation diagrams and signage

### Compliance Obligations

**Strata Owners Corporation Must:**
- Maintain all fire safety measures to minimum standards
- Conduct annual assessments by accredited practitioners
- Submit AFSS to council and Fire & Rescue NSW annually
- Display current AFSS in prominent location
- Keep records of all inspections and maintenance
- Conduct regular evacuation drills
- Maintain emergency plans

**Penalties for Non-Compliance:**
- Fines for late or missing AFSS
- Potential liability in case of fire incident
- Insurance claims may be denied
- Council enforcement action

---

## Part 2: Debt Recovery Requirements

### Legal Framework

**Primary Legislation:**
- NSW Strata Schemes Management Act 2015 (Section 86)
- Strata Schemes Management Regulation 2016
- 2025 Debt Recovery Reforms (Effective 2025)

**Key Requirements:**


1. **Payment Plan Mandatory Offer** (2025 Reform)
   - Owners Corporation MUST offer payment plan before debt recovery
   - Cannot take recovery action without offering payment plan first
   - Cannot proceed with recovery while payment plan is being followed

2. **Payment Plan Terms**
   - Maximum duration: 12 months
   - Owner must use standard payment plan request form
   - No additional information can be requested beyond standard form
   - Response required within 28 days
   - Approval requires majority vote at OC or committee meeting
   - Cannot be delegated to strata manager

3. **Payment Application Order** (Mandatory)
   - First: Oldest overdue levies
   - Second: Interest charges
   - Third: Recovery costs
   - (Unless court/tribunal order or owner specifies otherwise)

4. **Recovery Action Requirements**
   - Can only recover after offering payment plan
   - Requires NSW Civil and Administrative Tribunal (NCAT) or court order
   - Cannot recover costs without tribunal/court order
   - Must provide 28-day response to payment plan requests

5. **Interest Charges**
   - Can charge interest on overdue levies
   - Interest starts 30 days after levy due date
   - Emergency levies: 14 days
   - Owner can request interest waiver (separate vote required)

6. **Refusal Grounds**
   - Payment plan may be refused if it would cause:
     - Fund to fall into deficit
     - Insufficient funds for common property maintenance
     - Insufficient funds for administrative expenses
     - Non-compliance with Fair Trading orders
   - Refusal must include written reasons

7. **Owner Rights**
   - Right to request payment plan using standard form
   - Right to request interest waiver
   - Right to request plan extension
   - Right to mediation if request refused (free via NSW Fair Trading)
   - Right to NCAT appeal if mediation fails

8. **Privacy Protection**
   - Standard form doesn't require financial situation details
   - Scheme cannot request additional financial information
   - Arrears visible in AGM financial reports
   - Non-financial members lose voting rights until paid

---

## Part 3: Implementation Plan

### Module 1: Fire Safety Compliance System

**Database Models Required:**

```prisma
model FireSafetySchedule {
  id              String   @id @default(uuid())
  buildingId      String
  issuedBy        String   // Council or certifier name
  issueDate       DateTime
  measures        FireSafetyMeasure[]
}

model FireSafetyMeasure {
  id              String   @id @default(uuid())
  scheduleId      String
  measureType     String   // fire_alarm, sprinkler, extinguisher, exit_sign, etc.
  location        String
  standard        String   // AS1851-2012, etc.
  testingFrequency String  // monthly, quarterly, annually
  lastTested      DateTime?
  nextTestDue     DateTime
  status          String   // compliant, overdue, failed
  notes           String?
}

model AnnualFireSafetyStatement {
  id              String   @id @default(uuid())
  buildingId      String
  year            Int
  issueDate       DateTime
  dueDate         DateTime
  status          String   // draft, submitted, overdue
  practitionerName String  // Accredited Practitioner
  practitionerNumber String
  submittedToCouncil Boolean @default(false)
  submittedToFireRescue Boolean @default(false)
  certificateUrl  String?
  displayedInBuilding Boolean @default(false)
}

model FireSafetyInspection {
  id              String   @id @default(uuid())
  buildingId      String
  measureId       String
  inspectionDate  DateTime
  inspectorName   String
  result          String   // pass, fail, requires_attention
  findings        String?
  correctiveActions String?
  nextInspectionDue DateTime
  certificateUrl  String?
}

model EmergencyPlan {
  id              String   @id @default(uuid())
  buildingId      String
  version         String
  approvedDate    DateTime
  evacuationProcedure String
  assemblyPoints  String   // JSON array
  emergencyContacts String // JSON array
  lastDrillDate   DateTime?
  nextDrillDue    DateTime
  documentUrl     String?
}
```

**Features:**

1. **Fire Safety Dashboard**
   - Overview of all fire safety measures
   - Compliance status indicators
   - Upcoming inspections and tests
   - Overdue items alerts
   - AFSS submission status

2. **AFSS Management**
   - Create annual statements
   - Track submission to council and Fire & Rescue NSW
   - Upload certificates
   - Display status tracking
   - Automatic reminders 60/30/7 days before due

3. **Inspection Tracking**
   - Schedule inspections
   - Record results
   - Upload certificates
   - Track corrective actions
   - Automatic next inspection scheduling

4. **Measure Management**
   - List all fire safety measures
   - Testing frequency tracking
   - Status monitoring
   - Maintenance history

5. **Emergency Planning**
   - Store emergency plans
   - Track evacuation drills
   - Manage assembly points
   - Emergency contact directory

---

### Module 2: Debt Recovery System

**Database Models Required:**

```prisma
model LevyPaymentPlan {
  id              String   @id @default(uuid())
  buildingId      String
  lotId           String
  userId          String
  status          String   // pending, approved, rejected, active, completed, defaulted
  requestDate     DateTime @default(now())
  responseDate    DateTime?
  approvedDate    DateTime?
  startDate       DateTime?
  endDate         DateTime?
  totalOwed       Float
  interestOwed    Float
  recoveryCosts   Float    @default(0)
  installmentAmount Float
  installmentFrequency String // weekly, fortnightly, monthly
  numberOfInstallments Int
  paidInstallments Int @default(0)
  requestInterestWaiver Boolean @default(false)
  interestWaived    Boolean @default(false)
  refusalReason     String?
  notes             String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  payments          PaymentPlanPayment[]
  extensions        PaymentPlanExtension[]
}

model PaymentPlanPayment {
  id              String   @id @default(uuid())
  planId          String
  installmentNumber Int
  dueDate         DateTime
  amount          Float
  paidDate        DateTime?
  paidAmount      Float?
  status          String   // pending, paid, overdue, partial
  paymentReference String?
  appliedToLevies Float    @default(0)
  appliedToInterest Float  @default(0)
  appliedToCosts  Float    @default(0)
  notes           String?
}

model PaymentPlanExtension {
  id              String   @id @default(uuid())
  planId          String
  requestDate     DateTime @default(now())
  requestedEndDate DateTime
  status          String   // pending, approved, rejected
  reason          String
  responseDate    DateTime?
  approvedBy      String?
  notes           String?
}

model DebtRecoveryAction {
  id              String   @id @default(uuid())
  buildingId      String
  lotId           String
  userId          String
  actionType      String   // notice, reminder, tribunal_application, court_action
  actionDate      DateTime @default(now())
  dueDate         DateTime?
  status          String   // pending, completed, cancelled
  amountOwed      Float
  description     String
  documentUrl     String?
  tribunalOrderNumber String?
  notes           String?
}

model LevyReminder {
  id              String   @id @default(uuid())
  levyId          String
  sentDate        DateTime @default(now())
  reminderType    String   // 7_day, 14_day, 30_day, final
  sentTo          String   // email address
  status          String   // sent, bounced, opened
}
```

**Features:**

1. **Overdue Levy Dashboard**
   - List all overdue levies
   - Days overdue calculation
   - Interest accrued
   - Payment plan status
   - Recovery action status

2. **Payment Plan Management**
   - Standard payment plan request form
   - 28-day response tracking
   - Committee/OC vote recording
   - Approval/rejection workflow
   - Payment plan statement generation
   - Extension requests

3. **Payment Tracking**
   - Record payments
   - Automatic application order (levies → interest → costs)
   - Payment history
   - Installment status
   - Overdue installment alerts

4. **Automated Reminders**
   - 7-day reminder before due date
   - Due date reminder
   - 7-day overdue notice
   - 14-day overdue notice
   - 30-day final notice
   - Email notifications

5. **Interest Calculation**
   - Automatic interest calculation (30 days after due)
   - Interest waiver requests
   - Interest waiver voting
   - Interest history tracking

6. **Recovery Action Tracking**
   - Payment plan offer tracking
   - Tribunal application preparation
   - Court order tracking
   - Recovery cost tracking
   - Document management

7. **Compliance Checks**
   - Ensure payment plan offered before recovery
   - Block recovery action if plan active
   - 28-day response deadline tracking
   - Standard form validation

8. **Reporting**
   - Overdue levy reports
   - Payment plan status reports
   - Recovery action reports
   - Financial hardship statistics
   - Compliance reports

---

## Part 4: User Interface Design

### Fire Safety Module Pages

1. **/dashboard/compliance/fire-safety**
   - Overview dashboard
   - Compliance status
   - Upcoming tasks
   - Alerts and warnings

2. **/dashboard/compliance/fire-safety/afss**
   - AFSS list (by year)
   - Create new AFSS
   - Submit to authorities
   - Upload certificates
   - Display status

3. **/dashboard/compliance/fire-safety/measures**
   - List all fire safety measures
   - Add/edit measures
   - Testing schedule
   - Inspection history

4. **/dashboard/compliance/fire-safety/inspections**
   - Schedule inspections
   - Record results
   - Upload certificates
   - Track corrective actions

5. **/dashboard/compliance/fire-safety/emergency-plan**
   - View/edit emergency plan
   - Evacuation procedures
   - Assembly points
   - Drill scheduling

### Debt Recovery Module Pages

1. **/dashboard/finance/debt-recovery**
   - Overview dashboard
   - Overdue levies summary
   - Payment plans status
   - Recovery actions

2. **/dashboard/finance/debt-recovery/overdue**
   - List overdue levies
   - Days overdue
   - Interest calculation
   - Action buttons

3. **/dashboard/finance/debt-recovery/payment-plans**
   - Active payment plans
   - Pending requests
   - Completed plans
   - Defaulted plans

4. **/dashboard/finance/debt-recovery/payment-plans/[id]**
   - Plan details
   - Payment schedule
   - Payment history
   - Extension requests

5. **/dashboard/finance/debt-recovery/payment-plans/new** (Owner view)
   - Standard payment plan request form
   - Calculate affordable payments
   - Request interest waiver
   - Submit request

6. **/dashboard/finance/debt-recovery/actions**
   - Recovery action history
   - Tribunal applications
   - Court orders
   - Document uploads

---

## Part 5: Implementation Timeline

### Week 1: Database & Backend
- [ ] Add database models to schema.prisma
- [ ] Create migration
- [ ] Add seed data for testing
- [ ] Create server actions for both modules

### Week 2: Fire Safety UI
- [ ] Fire safety dashboard
- [ ] AFSS management pages
- [ ] Measure tracking pages
- [ ] Inspection recording

### Week 3: Debt Recovery UI
- [ ] Debt recovery dashboard
- [ ] Overdue levy list
- [ ] Payment plan request form (owner)
- [ ] Payment plan management (manager)

### Week 4: Integration & Testing
- [ ] Automated reminders
- [ ] Email notifications
- [ ] Interest calculations
- [ ] Compliance checks
- [ ] Testing and bug fixes

---

## Part 6: Compliance Disclaimers

**Fire Safety Module:**
> "Dulili's Fire Safety Compliance module is a record-keeping and tracking tool. It does not replace the requirement for physical fire safety systems, accredited practitioner assessments, or compliance with AS1851-2012. Building owners remain responsible for all fire safety obligations under NSW law."

**Debt Recovery Module:**
> "Dulili's Debt Recovery module implements NSW Strata Schemes Management Act requirements. All recovery actions must comply with Section 86 and 2025 reforms. This tool does not provide legal advice. Consult a solicitor for complex debt recovery matters."

---

## Part 7: Key Success Metrics

**Fire Safety:**
- 100% AFSS submission tracking
- Zero missed inspection deadlines
- Automated reminders 60/30/7 days before due
- Complete audit trail for compliance

**Debt Recovery:**
- 100% compliance with payment plan offer requirement
- 28-day response time tracking
- Correct payment application order
- Standard form validation
- Complete audit trail for legal proceedings

---

**Sources:**
- [NSW Government - Fire Safety Measures](https://www.nsw.gov.au/departments-and-agencies/building-commission/current-and-future-homeowners/fire-safety-measures-strata)
- [NSW Government - Payment Plans](https://www.nsw.gov.au/housing-and-construction/strata/living/arrange-a-payment-plan)
- [NSW Government - Assessing Payment Plans](https://www.nsw.gov.au/housing-and-construction/strata/serving-on-a-committee/supporting-strata-owners-financial-hardship/assessing-a-payment-plan-for-unpaid-strata-levies)
- Environmental Planning and Assessment (Development Certification and Fire Safety) Regulation 2021
- NSW Strata Schemes Management Act 2015

Content was rephrased for compliance with licensing restrictions.
