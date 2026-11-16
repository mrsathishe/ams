# Kootukudil (கூட்டுக்குடில்)

## Apartment Community Management System --- Product & Implementation Roadmap

**Product name:** Kootukudil\
**Meaning / positioning:** A shared home and connected residential
community\
**Product type:** Web application + installable Android application (iOS
later)\
**Initial priority:** Common electricity (EB) bill and collection
management

---

## Current Implementation Status (2026-11-16)

Current working branch: `kootukudil`. The implementation is still uncommitted in the worktree; preserve it as-is when continuing.

### Implemented in the repository

- Internal email/password authentication; external token exchange and public debug routes are removed from the active API.
- Pending membership access control, manually provisioned Super Admin, apartment/flat registration, membership approval and permission APIs.
- Common and Individual EB accounts, period bills, calculated balances/status, separate payments, payment-owner edits, and approval requests.
- React/Vite web UI for authentication, pending approval, apartment selection, EB bills/payments, approvals and apartment membership settings.
- Expo SDK 58 React Native app in `mobile/`, using Expo Router and SecureStore. It includes auth/onboarding, pending approval, EB accounts/bills/payments and an approval inbox.
- A preview EAS profile is configured for Android APK output. An APK has not been built or published.

### Not implemented or not verified

- PWA installation support and an APK-download page on the website are not implemented.
- No live resident workflow has been manually verified against MongoDB. A read-only MongoDB admin ping succeeded on 2026-11-16; this proves connectivity only, not auth, approval, isolation, billing or payment behavior.
- No automated test files were added, per the approved engineering constraint.
- The mobile UI does not yet expose all web management/edit flows. Mobile bill editing and the full membership/flat-permission management UI are incomplete.
- Production EAS builds need an Expo project/account and `EXPO_PUBLIC_API_URL` set to the deployed HTTPS API. No production API URL has been supplied.
- Expo dependency audit reports three moderate transitive `minimatch` advisories through `@expo/fingerprint`; forcing the suggested fix would downgrade Expo and was not done.

### Scope boundary

This status follows the approved Kootukudil implementation prompt (Apartment/Flat, Owner/Tenant, EB accounts and approvals). This older roadmap also describes Compound/Building hierarchy, EB share splitting/UPI collection, notifications and messaging. Those items are not implemented and must not be inferred from this status; obtain approval before adding them. Audit logs and backup/recovery remain explicitly deferred.

---

## 1. Product vision

Kootukudil helps residents of an apartment community manage shared
responsibilities and communicate with one another.

A single compound may contain multiple buildings. Each building contains
flats, and each flat may have multiple registered family members. The
application must preserve this hierarchy and make permissions explicit.

The first practical business problem to solve is the common electricity
bill: record each bill, split it by selected flats, collect each flat's
share, and let the bill payer confirm contributions.

### Core principles

- One account represents one person.
- An administrator is also a resident; administration is a permission,
  not a separate kind of person.
- A person may eventually belong to more than one compound.
- A flat contributes once to a bill, regardless of how many people are
  registered under that flat.
- Owners and Rentals share the same dashboard, but their available
  actions differ.
- Financial history must remain stable even when memberships or flat
  details change.
- The backend is the authority for authentication, permissions,
  calculations and payment state.

---

## 2. Existing project and technology

The implementation should build on the existing repository and avoid an
unnecessary rewrite.

Layer Current / recommended technology

---

Web frontend React 18, Vite 5, TypeScript
Styling Existing styling system; keep UI components reusable
Mobile React Native + Expo; Android first, iOS later
Backend Python + FastAPI
Database Existing MongoDB + Motor
API REST, shared by web and mobile
Deployment Existing VPS / hosting setup, refined as required

The existing application already has frontend and backend foundations,
including authentication, users, expenses, payments, documents,
analytics and admin-related code. Review what exists before adding or
replacing modules.

**Authentication decision:** Remove external authentication and retain
internal registration and login only.

**Database decision:** Continue with MongoDB for the current
implementation. Do not migrate to PostgreSQL as part of this scope
unless a separate technical decision is made.

---

## 3. Domain hierarchy

The core hierarchy is:

```text
Kootukudil platform
└── Compound / Apartment Community
    ├── Compound Group
    ├── Building: MP Milan
    │   ├── Flat: A-101
    │   │   ├── Member 1 (Owner)
    │   │   └── Member 2 (Rental)
    │   └── Flat: A-102
    └── Building: MP Livit
        └── Flat: B-101
```

### Entity definitions

- **Compound:** The complete apartment community. It has a unique
  platform ID and a compound-wide group.
- **Building:** A separately identified building inside a compound.
- **Flat:** A unit belonging to one building.
- **User:** One person's login account and personal profile.
- **Membership:** The relationship between a user and a specific
  flat/community, including Owner or Rental status and approval state.

A compound can contain several buildings. All buildings belong to the
same compound group, while each flat has its own private group.

### Flat identifiers

A flat identifier is a string, not an integer. Valid examples include
`1`, `101`, `A`, `B`, `A-101`, `GF-2` and `12B`.

A flat identifier must be unique within its building, not globally.

---

## 4. Accounts, registration and membership

### User accounts

- Internal registration and login only.
- Users can edit their own profile.
- Secure password hashing and session/token handling are required.
- A user may have memberships in more than one compound in the future.
- Do not use one global apartment-admin flag to represent all
  community permissions.

### Owner and Rental relationship

During registration, the user selects their relationship to the selected
flat:

- Owner
- Rental

This relationship is separate from permissions. In particular, a Rental
cannot approve membership or manage common EB bills.

### Registration flow

1.  User registers or signs in.
2.  User selects an existing compound.
3.  User selects a building.
4.  User selects an existing flat.
5.  User selects Owner or Rental.
6.  Membership is created in `pending` state.
7.  An already-approved Owner associated with that same flat can approve
    the request.
8.  Super Admin can also approve or override.
9.  Once approved, the member can access permitted community
    information.

A normal user must not create a new flat during registration. Adding a
missing flat is a management operation.

Pending members must not access apartment financial information or
private community messages.

### Initial community setup

- Super Admin creates the initial compound record and its unique
  Compound ID and Group ID.
- Super Admin creates the initial building records and their unique
  Building IDs.
- Flats are added under the appropriate building through an authorized
  management flow.
- This initial setup is controlled; public registration must not
  create arbitrary compounds or buildings.

---

## 5. Compound and building detail changes

Users may request edits to compound and building details after initial
creation.

Editable details include:

- Name
- Address
- Area / locality
- City
- State
- PIN code
- Location details, where supported

### Approval policy

- If two or more approved Owners exist for the relevant
  compound/building approval scope, two distinct Owner approvals are
  required.
- If only one approved Owner exists, the change can be applied without
  an additional approval.
- Rentals cannot approve these changes.
- Keep the existing details visible while an approval request is
  pending.
- Apply the proposed changes only when the required approval condition
  is met.
- A building edit must not change another building.
- No permanent audit-history feature is required for ordinary detail
  edits.

Use a temporary change-request record while approval is pending. Once
the request is applied or rejected, it can be removed according to the
agreed retention behavior.

**Policy detail to confirm during implementation:** Define precisely
which Owner set is counted for a compound edit versus a building edit,
and whether the person requesting the change may provide one of the
required approvals. Do not silently invent this policy.

---

## 6. Common EB account and bills

### EB account

The common electricity connection may belong to:

- The entire compound, or
- A specific building.

Do not assume every compound has exactly one connection. Support
multiple EB accounts where the real electrical setup requires them.

Store the common service connection number and relevant account details.
Approved members can view the common connection details. Authorized
Owners can manage them.

Optional private EB records may be maintained by an individual user.
These records must be visible only to that user and excluded from common
bill calculations.

### Bill creation

Bills are generally received approximately every two months, but do not
implement an automatic two-month bill generator.

An Owner manually creates a bill when the bill arrives.

Bill fields:

- EB account reference
- Bill month (default to current month; editable)
- Total amount
- Optional due date
- Person who paid the electricity board bill (collector)
- Optional bill image or PDF
- Selected flats and calculated share amounts
- Creation timestamp and creator

### Bill-arrived announcement

Sometimes the physical/online bill has arrived but the amount has not
yet been entered. An Owner must be able to publish an **EB bill
arrived** announcement separately from creating the bill. It should
appear on the dashboard and notify the relevant compound members.

### Flat-wise splitting

Initial supported split methods:

1.  All eligible flats under the EB account.
2.  Selected flats only.

Split the total equally across selected flats, not across people.

Example:

- Total bill: ₹6,000
- Selected flats: 4
- Share per flat: ₹1,500

A flat with three registered members still contributes only ₹1,500.

When a bill is created, save a snapshot of the selected flat IDs and
each flat's amount. Later changes to membership, flat records or the
building must not change historical shares.

Custom, meter-based or consumption-based splitting is outside the
initial scope.

---

## 7. Payment collection and approval

The person who pays the actual EB board bill is the collector for that
billing cycle.

### Collector responsibilities

- Maintain UPI ID / VPA, display name and preferred payment app.
- Receive payment reports from other flats.
- Approve or reject reported contributions.
- Provide a rejection reason where appropriate.

### Resident payment flow

1.  Resident opens the bill and sees their flat's share.
2.  Resident pays the collector using UPI.
3.  Resident reports the payment in Kootukudil.
4.  They may enter a UPI transaction reference and attach a screenshot.
5.  Payment becomes `pending_approval`.
6.  Collector receives a notification.
7.  Collector approves or rejects the report.
8.  Only an approved payment becomes confirmed/paid.

Opening a UPI app or scanning a QR code is not proof of payment. Do not
automatically mark a payment as paid unless a future verified
payment-provider integration is implemented.

### UPI QR

Generate a dynamic UPI QR using the collector's VPA, display name,
amount, INR currency and bill description.

Example URI:

```text
upi://pay?pa=collector@upi&pn=Sathish&am=1500&cu=INR&tn=November%20EB%20Bill
```

- Android can launch a compatible UPI app using an intent.
- Mobile web can attempt a compatible deep link where supported.
- Desktop can display a QR for scanning.
- The QR must use the correct flat share amount.
- QR generation must not itself confirm payment.

### Collector reassignment

Super Admin may reassign the collector if the original collector is
unavailable. Preserve enough reassignment information to identify the
original collector and the new collector.

Payment status must be tracked at the flat-share level so multiple
family members do not accidentally create multiple obligations for one
flat.

---

## 8. Notifications

Provide a notification bell with a dynamic unread count.

Notification events include:

- New EB bill or bill-arrived announcement.
- Payment reported to collector.
- Payment approved or rejected.
- New member registration requiring approval.
- Registration approved.
- Compound/building change request requiring approval.
- Community or flat announcement.

Notification centre actions:

- Mark one notification as read.
- Mark all as read.
- Delete one notification.
- Automatically delete notifications older than six months.

The six-month retention rule applies only to notifications. Do not
delete bills, payments, approvals or financial documents under this
rule.

---

## 9. Messaging and broadcasts

Support these communication scopes:

1.  **Compound group:** Shared across all buildings in the compound.
2.  **Flat group:** Private to approved members of the same flat.
3.  **Targeted broadcast:** A permitted sender selects the whole
    compound, a building or a flat.

Examples:

- EB bill announcement → compound.
- Water maintenance notice → selected building.
- Flat meeting reminder → one flat.

Do not create a persistent building chat group unless that is explicitly
selected later. A building-targeted broadcast can be an announcement.

**Permission detail to confirm:** Decide whether every approved member
can broadcast or whether broadcast is restricted to designated
Owners/administrators.

All messaging APIs must enforce membership and scope on the backend. A
user must never be able to read another compound's or another flat's
private messages by changing an ID in a request.

---

## 10. Dashboard and navigation

Use one common dashboard layout for Owners and Rentals. Do not create
separate dashboard designs.

Show actions based on backend-provided permissions.

Suggested dashboard sections:

- EB Management
- Current bill and flat share
- Payment status
- Pending approvals
- Members
- Documents
- Notifications
- Messages / announcements

Header:

- Kootukudil branding
- Notification bell and unread count
- Signed-in user's name/profile
- Sign out

Owners see permitted management actions. Rentals see relevant
information and actions such as reporting their flat's payment.

---

## 11. Suggested MongoDB collections

These are logical starting points. Review existing collections and reuse
or migrate them carefully rather than duplicating data.

---

Collection Purpose

---

`users` Global account and personal profile

`compounds` Community identity, address and
Group ID

`buildings` Buildings within a compound

`flats` Flat identifiers within buildings

`memberships` User-to-compound/building/flat
relationship and approval

`entity_change_requests` Temporary compound/building edit
approval

`eb_accounts` Common EB connections

`personal_eb_accounts` Optional private EB information

`eb_bills` Common bill metadata and collector

`eb_shares` Per-flat bill share snapshot

`eb_payments` Payment reports and collector
decisions

`upi_profiles` Collector payment details

`documents` Common/private document metadata

`notifications` Per-user notifications

`messages` Compound/flat messages and targeted
announcements

---

### Data integrity requirements

- Use stable IDs and references between documents.
- Add indexes for frequently queried fields.
- Enforce unique flat identifiers within a building.
- Prevent duplicate membership records where the same user/flat
  membership is not allowed.
- Validate compound, building and flat relationships on the backend.
- Store money as integer paise or a carefully standardized decimal
  representation; avoid binary floating-point arithmetic.
- Use server-side transactions or safe state-transition patterns where
  multiple financial records must change together.
- Store uploaded file metadata in MongoDB, but store file bytes in
  appropriate file/object storage.

---

## 12. Security and reliability

Minimum requirements before real residents use the application:

- Passwords hashed with a modern password-hashing algorithm.
- Secure access-token/session lifecycle and protected refresh flow if
  refresh tokens are used.
- Authorization checked in FastAPI for every protected operation.
- Compound, building and flat scope validation on every relevant API
  request.
- Pending members blocked from financial and private messaging APIs.
- Owner/Rental permissions enforced server-side.
- No trusting role or user IDs supplied by the browser without
  verifying them against the authenticated identity.
- Input validation and safe file upload limits/type checks.
- Rate limiting for login and registration.
- Secrets stored in environment configuration, not source code.
- Production CORS, HTTPS and secure cookie/token settings configured
  deliberately.
- Database backups and restore testing.
- Remove or protect debug endpoints before production.
- Review public registration so users cannot self-assign Super Admin
  or privileged permissions.

---

## 13. Delivery phases

Phase Deliverable

---

1 Internal authentication and profile
2 Compound, building, flat and membership
3 Membership approval and entity detail changes
4 Common EB account and optional private EB records
5 EB bill creation, flat selection and split snapshot
6 Payment reporting, UPI QR, approval and reassignment
7 Notifications, messages and broadcasts
8 Android app, APK distribution and iOS planning

### First milestone acceptance test

The first milestone is complete when:

1.  Super Admin can sign in.
2.  Super Admin creates one compound and its Group ID.
3.  Super Admin creates MP Milan and MP Livit as two buildings.
4.  Flats can be created under each building.
5.  A person can register as Owner or Rental against an existing flat.
6.  The membership is pending until an eligible Owner of that same flat
    approves it, or Super Admin approves it.
7.  A Rental cannot approve another member.
8.  Multiple people can be associated with one flat.
9.  Both buildings' residents belong to the same compound.
10. A member cannot access another flat's private group or another
    compound's data.

Do not start the complete EB workflow until this foundation passes its
acceptance tests.

---

## 14. Mobile distribution

- Android is the first mobile target.
- Build with React Native + Expo.
- Provide an APK download from the Kootukudil website.
- The APK can be distributed directly without publishing to Google
  Play, subject to Android installation/security prompts.
- iOS distribution is different: a public website cannot freely
  distribute an installable IPA to arbitrary devices. Evaluate
  TestFlight, Ad Hoc distribution constraints, or a Progressive Web
  App for iOS.

---

## 15. Development approach

- Inspect the current repository before editing.
- Preserve working features unless they directly conflict with the
  agreed requirements.
- Implement one phase at a time.
- For each phase, define data models, API contracts, UI screens,
  permissions and acceptance tests.
- Keep frontend modules aligned with backend business domains.
- Use migrations or controlled data transformations for existing
  records.
- Add automated tests for permissions, financial calculations and
  approval state transitions.
- Do not claim a phase is complete until its acceptance tests pass.

**Immediate next step:** Audit the current codebase and produce a gap
analysis for Phase 1 and Phase 2. Then implement the first milestone in
small, reviewable steps.
