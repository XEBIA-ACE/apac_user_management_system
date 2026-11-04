# User flows

## J-01 · New User Registration and OTP Verification (P-01: Maya Chen)
Covers the end-to-end happy path and all exception branches for a first-time registrant: form submission with inline validation, OTP dispatch, OTP entry within the 5-minute window, account activation, and all failure states (SMTP failure, OTP expiry, resend, browser-tab-close recovery).

### Diagram

```mermaid
graph TD
    classDef screen fill:#4A90D9,stroke:#2C5F8A,color:#fff,rx:6
    classDef error fill:#E8534A,stroke:#A33028,color:#fff,rx:6
    classDef recovery fill:#F5A623,stroke:#B87318,color:#fff,rx:6
    classDef success fill:#27AE60,stroke:#1A7A42,color:#fff,rx:6
    classDef decision fill:#8E44AD,stroke:#5E2D75,color:#fff,rx:6

    A[SMP-001: Entry Point / Browser URL]
    B[SMP-002: Registration Screen]
    D1{Form Valid?}
    D2{Email Unique?}
    D3{SMTP Success?}
    C[SMP-003: OTP Verification Screen]
    D4{OTP Expired?}
    D5{OTP Correct?}
    K[SMP-011: OTP Expiry Warning State]
    F[SMP-006: OTP Recovery Hub]
    J[SMP-010: SMTP Failure Error State]
    D6{Resend Limit Reached?}
    D[SMP-004: Login Screen]
    SUC[Account Activated — Redirect to Login with Success Message]

    A --> B
    B --> D1
    D1 -- Invalid Fields --> B
    D1 -- Valid --> D2
    D2 -- Duplicate Email --> B
    D2 -- Unique --> D3
    D3 -- Fail --> J
    J -- Retry --> D3
    D3 -- Success --> C
    C --> D4
    D4 -- Not Expired --> D5
    D4 -- Expired --> K
    K --> D6
    D6 -- Limit Not Reached --> F
    D6 -- Limit Reached --> B
    F --> C
    D5 -- Incorrect OTP --> C
    D5 -- Correct OTP --> SUC
    SUC --> D

    class A,B,C,D,F,J,K screen
    class D1,D2,D3,D4,D5,D6 decision
    class SUC success
```

## J-02 · Returning User Login and Session Management (P-02: Jordan Okafor)
Covers the returning authenticated user journey: expired-session redirect to login, credential validation, dashboard access, session continuity, mid-task session expiry handling, and explicit logout with server-side session invalidation.

### Diagram

```mermaid
graph TD
    classDef screen fill:#4A90D9,stroke:#2C5F8A,color:#fff,rx:6
    classDef error fill:#E8534A,stroke:#A33028,color:#fff,rx:6
    classDef success fill:#27AE60,stroke:#1A7A42,color:#fff,rx:6
    classDef decision fill:#8E44AD,stroke:#5E2D75,color:#fff,rx:6

    A[SMP-001: Entry Point / Browser URL]
    D[SMP-004: Login Screen]
    I[SMP-009: Session Expiry Re-Auth Screen]
    D1{Valid Session?}
    D2{Credentials Valid?}
    D3{Account Verified?}
    L[SMP-012: Invalid Credentials Error State]
    M[SMP-013: Unverified Account Contextual Prompt]
    F[SMP-006: OTP Recovery Hub]
    E[SMP-005: Dashboard]
    D4{Session Active?}
    P[SMP-016: Invalid Session Error State]
    LOGOUT[Session Invalidated — User Logged Out]

    A --> D1
    D1 -- No Valid Session --> D
    D1 -- Session Expired --> I
    I --> D
    D --> D2
    D2 -- Invalid --> L
    L --> D
    D2 -- Valid --> D3
    D3 -- Unverified --> M
    M --> F
    D3 -- Verified --> E
    E --> D4
    D4 -- Session Expired Mid-Task --> I
    D4 -- Invalid Token --> P
    P --> D
    D4 -- Active --> E
    E -- Logout --> LOGOUT
    LOGOUT --> D

    class A,D,E,F,I,L,M,P screen
    class D1,D2,D3,D4 decision
    class LOGOUT success
```

## J-03 · Account Deletion Flow (P-03: Priya Nair)
Covers the full account deletion journey for an authenticated user: initiating deletion from the Dashboard, server-side ownership check, mandatory confirmation with itemised data scope, session-expiry-aware re-entry, atomic deletion, post-deletion confirmation screen and email, and deletion rollback error handling.

### Diagram

```mermaid
graph TD
    classDef screen fill:#4A90D9,stroke:#2C5F8A,color:#fff,rx:6
    classDef error fill:#E8534A,stroke:#A33028,color:#fff,rx:6
    classDef success fill:#27AE60,stroke:#1A7A42,color:#fff,rx:6
    classDef decision fill:#8E44AD,stroke:#5E2D75,color:#fff,rx:6

    E[SMP-005: Dashboard]
    D1{Ownership Check Passed?}
    G[SMP-007: Account Deletion Confirmation]
    D2{Session Active?}
    I[SMP-009: Session Expiry Re-Auth Screen]
    D3{User Confirms Deletion?}
    D4{Deletion Successful?}
    N[SMP-014: Deletion Rollback Error State]
    H[SMP-008: Post-Deletion Confirmation Screen]
    O[SMP-015: Post-Deletion Confirmation Email]
    D[SMP-004: Login Screen]

    E --> D1
    D1 -- Fail --> E
    D1 -- Pass --> G
    G --> D2
    D2 -- Session Expired --> I
    I --> G
    D2 -- Active --> D3
    D3 -- Cancel --> E
    D3 -- Confirm --> D4
    D4 -- System Error --> N
    N --> E
    D4 -- Success --> H
    H --> O
    H --> D

    class E,G,H,I,N,D screen
    class D1,D2,D3,D4 decision
    class O success
```

## J-04 · Stranded Registrant Recovery via OTP Recovery Hub (P-04: Sam Rivera)
Covers the recovery journey for a stranded registrant who closed the browser before OTP entry or whose OTP expired. Includes login denial with anti-enumeration-safe contextual prompt, navigation to the OTP Recovery Hub, new OTP request, OTP verification, and successful account activation.

### Diagram

```mermaid
graph TD
    classDef screen fill:#4A90D9,stroke:#2C5F8A,color:#fff,rx:6
    classDef error fill:#E8534A,stroke:#A33028,color:#fff,rx:6
    classDef success fill:#27AE60,stroke:#1A7A42,color:#fff,rx:6
    classDef decision fill:#8E44AD,stroke:#5E2D75,color:#fff,rx:6

    A[SMP-001: Entry Point / Browser URL]
    D[SMP-004: Login Screen]
    D1{Credentials Valid and Account Verified?}
    L[SMP-012: Invalid Credentials Error State]
    M[SMP-013: Unverified Account Contextual Prompt]
    F[SMP-006: OTP Recovery Hub]
    D2{SMTP Dispatch Success?}
    J[SMP-010: SMTP Failure Error State]
    C[SMP-003: OTP Verification Screen]
    D3{OTP Correct and Within Window?}
    K[SMP-011: OTP Expiry Warning State]
    D4{Resend Limit Reached?}
    SUC[Account Activated — Redirect to Login with Success Message]

    A --> D
    D --> D1
    D1 -- Invalid Credentials --> L
    L --> D
    D1 -- Unverified Account --> M
    M --> F
    F --> D2
    D2 -- Fail --> J
    J -- Retry --> D2
    D2 -- Success --> C
    C --> D3
    D3 -- Incorrect or Expired --> K
    K --> D4
    D4 -- Limit Not Reached --> F
    D4 -- Limit Reached --> D
    D3 -- Correct and Valid --> SUC
    SUC --> D

    class A,C,D,F,J,K,L,M screen
    class D1,D2,D3,D4 decision
    class SUC success
```

## F-05 · Server-Side Rejection UX Layer — All Error State Coverage
Comprehensive map of every server-side rejection scenario and its paired user-facing error state with defined next-step actions. Covers: unverified-account login denial, session expiry mid-flow, SMTP failure, deletion rollback, OTP expiry, invalid/tampered session token, and concurrent request handling. Ensures zero silent failures across the full account lifecycle.

### Diagram

```mermaid
graph TD
    classDef screen fill:#4A90D9,stroke:#2C5F8A,color:#fff,rx:6
    classDef error fill:#E8534A,stroke:#A33028,color:#fff,rx:6
    classDef recovery fill:#F5A623,stroke:#B87318,color:#fff,rx:6
    classDef decision fill:#8E44AD,stroke:#5E2D75,color:#fff,rx:6

    SS[Server-Side Rejection Event]
    R1{Rejection Type}
    D[SMP-004: Login Screen]
    M[SMP-013: Unverified Account Contextual Prompt]
    F[SMP-006: OTP Recovery Hub]
    I[SMP-009: Session Expiry Re-Auth Screen]
    G[SMP-007: Account Deletion Confirmation]
    J[SMP-010: SMTP Failure Error State]
    C[SMP-003: OTP Verification Screen]
    K[SMP-011: OTP Expiry Warning State]
    N[SMP-014: Deletion Rollback Error State]
    E[SMP-005: Dashboard]
    P[SMP-016: Invalid Session Error State]
    L[SMP-012: Invalid Credentials Error State]
    CONC[Concurrent Request — Graceful Handling TBD]

    SS --> R1
    R1 -- Unverified Account Login Denial --> M
    M --> F
    R1 -- Session Expiry Mid-Login or Mid-Navigation --> I
    I --> D
    R1 -- Session Expiry Mid-Deletion Confirmation --> I
    I --> G
    R1 -- SMTP Failure on OTP Dispatch --> J
    J --> C
    R1 -- OTP Expired --> K
    K --> F
    R1 -- Deletion Rollback on System Error --> N
    N --> E
    R1 -- Invalid or Tampered Session Token --> P
    P --> D
    R1 -- Invalid Credentials at Login --> L
    L --> D
    R1 -- Concurrent Deletion Request --> CONC

    class D,C,E,F,G,I,J,K,L,M,N,P screen
    class R1 decision
    class SS error
    class CONC recovery
```
