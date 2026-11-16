# Kootukudil (AMS) --- AI Implementation Prompt

## 1. Project objective

Build Kootukudil, a multi-apartment management application. The first
implementation phase is **EB (Electricity Board) bill and payment
management**.

Work incrementally. Implement only the current approved phase. Do not
build future modules just because they are mentioned in this document.

## 2. Existing technology and architecture

-   Preserve the existing frontend stack and project structure. The
    frontend is a React application.
-   Backend: Python 3.10+, FastAPI, MongoDB, Motor, Pydantic 2, JWT,
    bcrypt and Uvicorn.
-   The current backend runs on port `8001`.
-   Do not replace working architecture or introduce a new framework
    without explaining the reason and obtaining approval.
-   Inspect the existing code and documentation before changing it.
    Treat the actual repository as the source of truth for
    implementation details.

## 3. Application scope and platforms

### Implement now

-   Responsive React web application.
-   PWA support for installable web access.
-   Android APK build that can be downloaded and installed from the
    project website. Do not require Play Store publication.

### Defer

-   iOS distribution. Keep the architecture open to a future iOS build,
    but do not implement iOS packaging or distribution in this phase.
-   iOS can be evaluated later. Development builds may be installed on a
    personally owned iPhone from a Mac using Xcode, subject to Apple's
    signing and provisioning restrictions. Do not promise unrestricted
    direct installation.

The application must support **multiple apartments**. Every
apartment-owned record must be scoped to its apartment. Flat-specific
records must also be scoped to the relevant flat. A user may have
memberships in different apartments; never expose data across apartments
or flats without permission.

## 4. Authentication and registration

-   Remove external authentication providers and external token
    exchange.
-   Use internal registration and login only.
-   Only registered users can attempt to sign in.
-   A successfully authenticated but unapproved user must not access the
    dashboard.
-   Show an animated, switchable Login / Register interface on the same
    page. Keep the transitions lightweight and responsive.
-   Registration must capture the apartment, flat and relationship to
    that flat: `Owner` or `Tenant`.
-   Support selecting an existing flat or adding a flat during
    registration, subject to the existing apartment setup and validation
    rules.
-   The first member of a flat may provide the flat details.
-   Do not trust a role or permission submitted by the client. Determine
    permissions on the server.
-   Do not expose dashboard data or protected APIs to pending users.

### Pending approval experience

After login, an unapproved user sees a Pending Approval screen instead
of the dashboard.

The screen should: - Explain that approval is required before dashboard
access. - Show the names of eligible approvers associated with that
flat. - Explain whether an Owner or Tenant approval is required for the
applicant's membership type, according to the configured approval
rules. - Show names only. Do not show phone numbers, email addresses or
other contact details. - Refresh or otherwise reflect the approval state
so the user can proceed once approved.

## 5. Apartment and flat setup

-   Support multiple apartments.
-   Apartment setup includes an optional building/apartment name and
    total flat count.
-   Flats have a flat name or number.
-   Each user has an apartment membership and a flat relationship.
-   Keep apartment-level permissions separate from flat-level
    permissions.
-   Do not allow a user in one apartment to access another apartment's
    records merely by guessing an ID.

## 6. EB account types

Support two independent EB account types.

### 6.1 Common EB

-   Common EB is an apartment-level shared account.
-   An authorized person can enter the bill and payment information.
-   Common EB bill totals and payment information are visible to all
    members of that apartment, subject to the apartment's access rules.
-   All members who can view Common EB must be able to see the total
    shared amount and who has paid, how much they paid and the payment
    date.
-   Common EB records must not be visible to users from other
    apartments.

### 6.2 Individual EB

-   Individual EB belongs to a particular flat.
-   A flat may choose whether to maintain its Individual EB records.
-   These records are private to that flat and must not be shared with
    other flats.
-   Access is controlled by that flat's membership and permissions.

## 7. EB bill fields and calculation rules

Keep the existing list of EB entries by billing period. Each entry
represents one EB bill. Do not create a separate, complicated
transaction-history module.

Each bill should support these fields:

  -----------------------------------------------------------------------
  Field                               Requirement
  ----------------------------------- -----------------------------------
  Opening balance                     Initial unpaid amount when an EB
                                      account is first set up. Enter only
                                      for the initial account setup; use
                                      zero if there is no carried-forward
                                      debt.

  Previous balance                    Unpaid amount carried forward from
                                      the preceding bill for this same EB
                                      account. Calculate it from the
                                      previous record where possible.

  EB bill amount                      Amount charged for the current
                                      billing period.

  Amount paid                         Sum of payments recorded against
                                      this bill. Calculate from payment
                                      entries; do not treat it as a
                                      manually maintained duplicate
                                      total.

  Payment date                        Store on each payment entry.
                                      Required whenever a payment is
                                      recorded.

  Closing balance                     Remaining unpaid amount after
                                      payments. Calculate automatically;
                                      users should not need to enter it
                                      manually.

  Billing period                      From date and to date.

  Payment status                      Calculate or update as Pending,
                                      Partially Paid or Paid.
  -----------------------------------------------------------------------

### Accounting calculations

-   `Total payable = Previous balance + Current EB bill amount`
-   `Total paid = Sum of payment entries linked to this bill`
-   `Closing balance = Total payable - Total paid`
-   Do not allow a payment to make the closing balance negative unless
    an explicit overpayment/credit handling rule is designed and
    approved.
-   The first bill may have an opening balance. For that first bill, use
    the opening balance as the starting previous balance. Opening
    balance is **not** the first bill amount.
-   For subsequent bills, carry forward the previous bill's closing
    balance as the next bill's previous balance. Do not carry balances
    between unrelated EB accounts.
-   If there is no unpaid amount, the previous balance is zero.
-   Payment status:
    -   `Pending`: no payment has been recorded and an amount remains
        due.
    -   `Partially Paid`: some amount has been paid, but a balance
        remains.
    -   `Paid`: the total payable has been paid.
-   A payment date is mandatory for each payment record. An unpaid bill
    does not need a payment date.
-   Make calculated values read-only in the UI, while clearly displaying
    how they were calculated.

### Example

If the previous balance is ₹500 and the current bill is ₹1,500: - Total
payable: ₹2,000. - If ₹1,500 is paid, closing balance is ₹500 and status
is Partially Paid. - The next bill for this same EB account carries ₹500
forward as its previous balance.

## 8. Payment records --- especially Common EB

A bill and a payment are different records. One bill can have multiple
payments from different people.

For each payment, store at least: - Amount paid. - Paid by (the
authenticated user who made/recorded that payment). - Payment date. -
Link/reference to the EB bill.

### Common EB payment behaviour

-   Support multiple payments against one Common EB bill.
-   Each person may pay a portion of the total.
-   The application calculates total paid by summing all payment
    entries.
-   Display a shared summary to all apartment members who can view
    Common EB:
    -   Current bill amount.
    -   Previous balance.
    -   Total payable.
    -   Total amount paid.
    -   Remaining balance.
    -   Payment status.
-   Display the payment breakdown:
    -   Payer's name.
    -   Amount paid.
    -   Payment date.
-   Display who entered the bill, where appropriate.
-   A user may edit only their own payment entry. They must not edit
    another person's payment.
-   Enforce this ownership rule in the backend, not only by hiding UI
    controls.
-   Do not store just one `amount_paid` and one `paid_by` field on the
    bill. Use separate payment records linked to the bill, and derive
    the bill's total paid amount.

Use the same payment-record approach for Individual EB where applicable,
while keeping all records private to the relevant flat.

## 9. Permission matrix

Implement permissions on the backend and reflect them in the UI. The
following is the required baseline:

  -----------------------------------------------------------------------
  Operation         Super Admin       Owner             Tenant
  ----------------- ----------------- ----------------- -----------------
  View EB records   Yes               Yes               Only when
                                                        permitted by the
                                                        flat Owner

  Add EB bill       Yes               If authorized by  If authorized by
                                      Super Admin       the flat Owner

  Edit EB records   Yes               Yes, subject to   No
                                      approval          

  Approve flat      Yes               Same-flat Owner   Same-flat Tenant,
  member                                                where applicable

  Manage apartment  Yes               Yes, subject to   No
                                      approval          
  -----------------------------------------------------------------------

Additional rules: - Super Admin oversees the apartment. - A user
relationship (`Owner` / `Tenant`) is distinct from application
permissions. Do not equate relationship type with unrestricted system
privileges. - Owners can manage EB bills when authorized. - A Tenant can
view or add EB records only when the relevant flat Owner has granted
that permission. - A Tenant cannot edit EB records. - The person who
records a payment can edit only their own payment entry. - An Owner's EB
record changes require approval from other eligible flat Owners before
they become final. - Approval threshold for EB record edits: normally
two approvals. If the flat has only two Owners, one approval from the
other Owner is sufficient. - Apartment management changes by an Owner
also require approval. - Do not let a user approve their own change. -
Apply apartment and flat scope checks to every protected operation.

### Approval rule requiring confirmation

The approval threshold for apartment-level management changes has not
yet been finalized. Keep the approval workflow configurable and do not
assume that the EB-edit approval threshold automatically applies.
Confirm whether apartment management changes require approval from any
two Owners in the apartment or another rule before implementing that
workflow.

### Membership approval

-   Super Admin can approve membership.
-   An eligible same-flat Owner can approve a membership request.
-   A same-flat Tenant may approve a Tenant membership request where
    applicable, as allowed by the permission policy.
-   Prevent self-approval.
-   Only show eligible approvers' names on the applicant's Pending
    Approval screen.

## 10. Audit logs and backup/recovery --- future notes only

Do not implement either item in the current phase. Do not add audit-log
or backup/recovery infrastructure as part of the current EB work.

Keep these as future considerations: - Audit logs: potentially record
who changed what and when, with before/after values where appropriate. -
Data backup and recovery: define backup scheduling, retention, restore
procedures and recovery validation.

These are backlog notes only. Do not automatically implement them in
later phases unless explicitly requested and approved.

## 11. Security requirements

Audit the existing code before implementation. Do not assume existing
authentication or security code is safe.

-   Remove external authentication and token-exchange paths from the
    active login flow.
-   Hash passwords securely using bcrypt or an appropriate supported
    password-hashing configuration.
-   Use strong environment-provided secrets. Never use fallback/default
    JWT secrets in production.
-   Never log passwords, access tokens, refresh tokens or database
    credentials.
-   Never print MongoDB connection strings or secrets.
-   Validate all input with Pydantic and enforce authorization on the
    backend.
-   Protect against broken access control, IDOR, privilege escalation,
    injection, mass assignment and insecure file uploads.
-   Never accept role, apartment scope, flat scope or approval status as
    trusted client authority.
-   Enforce user, apartment, flat, EB-account and payment ownership
    checks on every relevant API.
-   Restrict CORS to approved origins in production.
-   Require HTTPS in production.
-   Keep secrets in environment variables; do not commit `.env` files or
    credentials.
-   Use safe error responses that do not expose stack traces or internal
    details.
-   Review existing debug endpoints and disable or protect them outside
    local development.
-   Apply reasonable request and upload size limits where uploads exist.
-   Ensure pending users cannot access dashboard APIs.
-   Keep dependencies minimal and maintained.

## 12. Code quality and engineering standards

-   Follow the existing architecture and coding conventions.
-   Use clear naming, small focused functions and reusable components
    where they genuinely reduce duplication.
-   Keep business rules out of presentation-only components.
-   Keep calculations and authorization rules consistent between
    frontend and backend; the backend is authoritative.
-   Avoid unnecessary dependencies, abstractions, duplicate state and
    dead code.
-   Handle loading, empty, validation, success and error states.
-   Fix all ESLint errors and warnings introduced by the work; do not
    suppress rules without a clear reason.
-   Do not rewrite unrelated files or features.
-   Do not create unit, integration or end-to-end test files unless
    explicitly requested.

Even though test files are not required, perform basic validation: - Run
ESLint. - Run the frontend production build. - Run relevant backend
checks available in the repository. - Perform focused manual smoke
checks for the changed flow. - Report any checks that could not be run.

## 13. Performance and UI/UX

Prioritize fast initial rendering, responsive interactions and a
lightweight interface.

-   Optimize first paint and initial bundle size.
-   Avoid unnecessary React re-renders and duplicated state.
-   Use memoization only when it provides a measurable or clear benefit.
-   Lazy-load routes or heavy components where appropriate.
-   Optimize images and static assets.
-   Avoid unnecessary network requests.
-   Prefer lightweight CSS transitions using opacity and transform.
-   Avoid heavy animation libraries unless genuinely required.
-   Respect `prefers-reduced-motion`.
-   Ensure responsive layouts for desktop, tablet and mobile.
-   Provide clear loading, empty, validation, success and error states.
-   Keep forms simple and avoid asking users to enter values that can be
    calculated.
-   Make calculated EB totals and payment breakdowns easy to understand.

### Login/Register interface

-   Login and Register must be available on one page.
-   Use switchable tabs or an equivalent clear toggle.
-   Animate the view transition smoothly without causing layout jank.
-   Keep login and registration forms separate and maintain their own
    validation.
-   Include password visibility controls.
-   Prevent duplicate submissions while a request is in progress.
-   Keep the page responsive and accessible.

## 14. Footer attribution

Include this footer attribution in the application:

**Developed by Sathish**

-   Phone: `+91 - 97900 60943` --- clickable link: `tel:+919790060943`
-   Email: `contact@satz.co.in` --- clickable link:
    `mailto:contact@satz.co.in`

## 15. Token efficiency and response discipline

Keep implementation responses concise to minimize unnecessary token
usage.

-   Do not repeat this prompt, project overview or decisions already
    documented.
-   Inspect only files relevant to the current task.
-   Prefer targeted edits over rewriting entire files.
-   Do not generate large explanations unless requested.
-   Do not add speculative features, unnecessary dependencies or
    abstractions.
-   Ask a question only when a missing decision blocks correct
    implementation.
-   Report only:
    1.  What changed.
    2.  Files affected.
    3.  Validation performed and its result.
    4.  Important blockers or decisions needed.

## 16. Incremental implementation rules

-   Implement only the current task or approved phase.
-   Do not implement future-phase features.
-   Do not modify unrelated functionality.
-   Preserve existing working behaviour unless the current task
    explicitly changes it.
-   Before a major architectural change, explain the reason and obtain
    approval.
-   If requirements conflict, stop and ask one focused clarification
    rather than guessing.
-   Do not treat future notes (audit logs and backup/recovery) as
    implementation requirements.

## 17. First action before coding

1.  Inspect the current repository structure and relevant
    frontend/backend files.
2.  Identify the existing authentication, apartment/flat membership, EB
    records and payment implementation, if any.
3.  Check the current data model and API contracts before proposing
    changes.
4.  Identify security issues that directly affect the requested work.
5.  Provide a concise implementation plan with the files/modules likely
    to change.
6.  Wait for approval before major architectural changes.
7.  Then implement the approved task incrementally and run the required
    validation.

**Priority:** Complete the internal authentication and approval flow
required for secure access, then implement multi-apartment scoping and
Phase 1 EB accounts, bills, multiple payments and shared Common EB
visibility. Do not build unrelated apartment-management modules in this
phase.
