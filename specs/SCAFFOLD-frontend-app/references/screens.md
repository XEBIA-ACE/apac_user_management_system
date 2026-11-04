# Screens

## Registration Screen [Web + Responsive Mobile]
Three-field registration form (name, email, password) with real-time inline validation, password complexity feedback, and clear submission error states. Handles duplicate-email rejection, syntactically invalid email rejection, and SMTP dispatch initiation on successful submission. Responsive layout for desktop and mobile browsers.

- Category: Onboarding
- Key elements: Page/screen heading (e.g., 'Create your account'), Name input field with inline validation, Email address input field with inline validation (format check), Password input field with real-time complexity feedback (rules TBD), Show/hide password toggle, Primary submit / 'Register' button, Field-level error messages (empty field, invalid email format, duplicate email), Duplicate-email error state (disclosure policy TBD with stakeholders), SMTP failure error state with retry option, Trust signal (HTTPS indicator, brief data-handling note), Link to Login screen for existing users, WCAG 2.1 AA compliant labels, contrast, and focus indicators
- Associated flows: J-01: New User Registration and OTP Verification (P-01: Maya Chen), F-01: User Registration with Email OTP Verification, F-05: Server-Side Rejection UX Layer — duplicate email, SMTP failure error states, Navigation to Login screen

## OTP Verification Screen [Web + Responsive Mobile]
OTP entry screen presented immediately after successful registration form submission. Includes a prominent countdown timer, expiry warning, resend OTP link (rate-limited), incorrect OTP error state, and expired OTP error state. Serves as the primary activation gate and the destination for users returning via the OTP Recovery Hub.

- Category: Onboarding
- Key elements: Screen heading (e.g., 'Verify your email'), Instructional copy indicating OTP was sent to the user's email address, OTP input field (format and length TBD with stakeholders), Prominent real-time countdown timer (5-minute window), OTP expiry warning state (distinct visual state when timer reaches zero), Incorrect OTP inline error message, Expired OTP error message with clear next-step action, Resend OTP link / button (rate-limited; max attempts TBD), Resend confirmation feedback (e.g., 'A new OTP has been sent'), Countdown reset on resend, Link / entry point to OTP Recovery Hub, Trust signal, WCAG 2.1 AA compliant labels, contrast, and focus indicators
- Associated flows: J-01: New User Registration and OTP Verification (P-01: Maya Chen), J-04: Stranded Registrant Recovery (P-04: Sam Rivera) — return to this screen via Recovery Hub, F-01: OTP entry, countdown timer, expiry warning, resend mechanism, F-04: OTP Resend and Verification Recovery Hub — resend entry point, F-05: Server-Side Rejection UX Layer — incorrect OTP, expired OTP, SMTP failure on resend

## OTP Verification Success Screen [Web + Responsive Mobile]
A distinct success/confirmation state shown after the user submits a valid OTP within the 5-minute window. Confirms account activation and directs the user to proceed to login. This is a separate screen state from the OTP Verification Screen to provide unambiguous closure on the activation step.

- Category: Onboarding
- Key elements: Success heading (e.g., 'Account activated!'), Confirmation message that email verification was successful and account is now active, Clear call-to-action button directing user to the Login screen, Trust signal, WCAG 2.1 AA compliant labels, contrast, and focus indicators
- Associated flows: J-01: New User Registration and OTP Verification — successful activation redirect, F-01: Successful OTP verification → redirect to Login with success message, J-04: Stranded Registrant Recovery — successful activation after Recovery Hub OTP

## Login Screen [Web + Responsive Mobile]
Two-field login form (email, password) with anti-enumeration generic error messaging for all credential failure states. Includes a contextual prompt for unverified-account denials directing users toward the OTP Recovery Hub. Displays a session-expiry contextual message when redirected from a protected area. Entry point to the OTP Recovery Hub for stranded registrants.

- Category: Authentication
- Key elements: Screen heading (e.g., 'Sign in'), Email address input field, Password input field, Show/hide password toggle, Primary 'Sign in' button, Generic anti-enumeration error message (does not reveal email existence or password correctness), Contextual prompt for unverified-account denial (e.g., 'If you recently registered, check your email or complete verification.') with link to OTP Recovery Hub, Session-expiry contextual message (shown when redirected from protected area or post-logout expiry), Link to OTP Recovery Hub / 'Complete verification' entry point, Link to Registration screen for new users, Trust signal (HTTPS indicator), WCAG 2.1 AA compliant labels, contrast, and focus indicators
- Associated flows: J-02: Returning User Login and Session Use (P-02: Jordan Okafor), J-04: Stranded Registrant Recovery (P-04: Sam Rivera) — contextual prompt and Recovery Hub entry, F-02: Secure User Login and Session Management, F-04: OTP Recovery Hub — entry point from Login screen, F-05: Server-Side Rejection UX Layer — anti-enumeration error, unverified-account denial, session-expiry message, invalid/tampered session token redirect

## Dashboard Screen [Web + Responsive Mobile]
Primary authenticated screen accessible only to users with a valid server-side session. Hosts the account deletion entry point (visible only to the authenticated owner). Includes a logout action accessible from all authenticated areas. Displays session-expiry contextual messaging when the session expires mid-task.

- Category: Authenticated Area
- Key elements: Authenticated user greeting / identity indicator, Main dashboard content area (protected content), Account deletion entry point / 'Delete Account' option (visible only to authenticated owner; server-side ownership check enforced), Logout button / link (accessible from all authenticated areas), Session-expiry contextual message / redirect handling, Navigation elements (as applicable to authenticated area), Trust signal, WCAG 2.1 AA compliant labels, contrast, and focus indicators
- Associated flows: J-02: Returning User Login and Session Use — authenticated landing after login, J-03: Account Deletion (P-03: Priya Nair) — deletion entry point, F-02: Session management, logout action, F-03: Account Deletion — entry point from Dashboard, F-05: Server-Side Rejection UX Layer — session expiry mid-task redirect

## Account Deletion Confirmation Screen [Web + Responsive Mobile]
A dedicated confirmation screen (not a modal overlay) that clearly states the deletion action is permanent and irreversible, itemises specific data categories to be removed (entities TBD with stakeholders), and requires a deliberate affirmative action (e.g., typed confirmation or clearly labelled destructive button). Includes a cancel option that returns the user to the Dashboard with no deletion occurring. Handles session-expiry-aware re-entry: if the session expires during this step, re-authentication returns the user here, not to the Dashboard.

- Category: Account Management
- Key elements: Screen heading (e.g., 'Delete your account'), Explicit irreversibility statement (e.g., 'This action is permanent and cannot be undone.'), Itemised list of data categories that will be removed (specific entities TBD with stakeholders), Deliberate affirmative confirmation mechanism (typed confirmation input and/or clearly labelled destructive 'Delete my account' button), Cancel / 'Keep my account' button (returns to Dashboard, no deletion), Session-expiry-aware re-entry indicator (contextual message if user was returned here after re-authentication), Trust signal / data handling note, WCAG 2.1 AA compliant labels, contrast, and focus indicators
- Associated flows: J-03: Account Deletion (P-03: Priya Nair) — mandatory confirmation step, F-03: Account Deletion — confirmation prompt, irreversibility statement, itemised data scope, F-05: Server-Side Rejection UX Layer — session expiry mid-confirmation, deletion rollback error state, Session-expiry-aware re-entry pattern (re-authentication returns user to this screen)

## Post-Deletion Confirmation Screen [Web + Responsive Mobile]
A distinct post-deletion confirmation state shown after atomic deletion completes successfully. Confirms deletion was successful, states that data has been removed, and informs the user that a confirmation email has been sent to their registered address. No authenticated session exists at this point; the screen is unauthenticated. Any attempt to navigate back to protected areas is denied.

- Category: Account Management
- Key elements: Distinct screen heading (e.g., 'Your account has been deleted'), Explicit confirmation message that the account and all associated data have been permanently removed, Notification that a confirmation email receipt has been sent to the registered address, Clear call-to-action (e.g., link to Registration screen or homepage), No navigation to authenticated/protected areas, Trust signal, WCAG 2.1 AA compliant labels, contrast, and focus indicators
- Associated flows: J-03: Account Deletion (P-03: Priya Nair) — post-deletion confirmation state, F-03: Account Deletion — post-deletion confirmation screen and email receipt, F-05: Server-Side Rejection UX Layer — distinct closure state (not generic logout)

## OTP Recovery Hub Screen [Web + Responsive Mobile]
A dedicated recovery screen where users can submit their email address to request a new OTP dispatch. The system responds identically regardless of whether an account exists for the email (anti-enumeration safe). On successful OTP dispatch, the user is directed to the OTP Verification screen with a fresh countdown timer. Rate-limiting is enforced on resend attempts (max attempts and cooldown TBD with stakeholders).

- Category: Recovery
- Key elements: Screen heading (e.g., 'Resend verification email' or 'Complete your verification'), Instructional copy explaining the purpose without revealing account existence, Email address input field, Submit / 'Send verification email' button, Anti-enumeration safe response message (identical response regardless of email existence), Rate-limit feedback state (e.g., 'Please wait before requesting another OTP'), SMTP failure error state with retry option, Link back to Login screen, WCAG 2.1 AA compliant labels, contrast, and focus indicators
- Associated flows: J-04: Stranded Registrant Recovery (P-04: Sam Rivera) — primary recovery flow, J-01: New User Registration — OTP resend/recovery from OTP Verification screen, F-04: OTP Resend and Verification Recovery Hub, F-05: Server-Side Rejection UX Layer — SMTP failure on resend, rate-limit state

## Deletion Rollback Error Screen [Web + Responsive Mobile]
A dedicated error screen (or distinct screen state within the deletion flow) shown when the deletion operation fails at the system level and the rollback has been applied. Clearly communicates that no deletion occurred, the account remains intact, and provides a clear next step (e.g., retry or contact support). Distinct from the generic session-expiry or login error states.

- Category: Error States
- Key elements: Error heading (e.g., 'Account deletion could not be completed'), Explicit message confirming the account is intact and no data was deleted (rollback applied), Clear explanation of what happened (system error, not user error), Defined next-step action (e.g., 'Try again' button returning to Deletion Confirmation, or support contact link), Link back to Dashboard, WCAG 2.1 AA compliant labels, contrast, and focus indicators
- Associated flows: J-03: Account Deletion (P-03: Priya Nair) — system error / rollback path, F-03: Account Deletion — deletion rollback on system error, F-05: Server-Side Rejection UX Layer — deletion rollback error state with defined next-step action

## Session Re-Authentication Screen (Deletion Flow) [Web + Responsive Mobile]
A contextual re-authentication screen (a specialised variant of the Login screen) displayed when the session expires specifically during the deletion confirmation step. Includes a clear contextual message explaining the session expired mid-deletion and that re-authentication is required to continue. On successful re-authentication, the system redirects to the Account Deletion Confirmation screen, not the Dashboard. Enforces the same anti-enumeration and security controls as the standard Login screen.

- Category: Authentication
- Key elements: Contextual heading (e.g., 'Your session expired — please sign in to continue'), Clear message explaining session expired during deletion confirmation and that the deletion has NOT been processed, Email address input field, Password input field, Show/hide password toggle, Re-authenticate / 'Sign in to continue' button, Anti-enumeration generic error message for failed credentials, On success: redirect to Account Deletion Confirmation screen (not Dashboard), Cancel option (returns to Login screen, abandons deletion flow), WCAG 2.1 AA compliant labels, contrast, and focus indicators
- Associated flows: J-03: Account Deletion (P-03: Priya Nair) — session expiry mid-confirmation re-entry pattern, F-03: Account Deletion — session-expiry-aware re-entry returning user to confirmation step, F-05: Server-Side Rejection UX Layer — session expiry mid-deletion-confirmation
