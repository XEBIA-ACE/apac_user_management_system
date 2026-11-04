# Reusable UI components

## Text Input
Single-line text input field used for Name and Email Address fields across Registration (SCR-001), Login (SCR-004), OTP Recovery Hub (SCR-008), and Session Re-Authentication (SCR-010) screens. Includes a visible label above the field, optional helper text below, and inline validation error state.

- Usage: Use for all single-line free-text and email inputs. Always render a visible label above the field. Never use placeholder text as a substitute for a label. Display inline error messages directly below the field on validation failure.
- States: Default, Focus, Filled, Error, Disabled
- Cross-platform notes: Web: 16px font-size on input prevents iOS Safari auto-zoom. Border-radius: 6px. Height: 44px minimum for touch targets. Mobile: Full-width within form container. Keyboard type='email' for email fields. Autocomplete attributes set appropriately (name, email).

## Password Input
Single-line password input with show/hide toggle icon. Used on Registration (SCR-001), Login (SCR-004), and Session Re-Authentication (SCR-010) screens. Includes real-time password complexity feedback on Registration screen (rules TBD with stakeholders).

- Usage: Use exclusively for password entry. Always include a show/hide toggle (eye icon) for usability. On the Registration screen, display real-time complexity feedback below the field as the user types. Label must always be visible above the field.
- States: Default, Focus, Filled / Password Hidden, Filled / Password Visible, Error, Disabled
- Cross-platform notes: Web: type='password' with toggle switching to type='text'. Show/hide toggle button must have aria-label ('Show password' / 'Hide password') and be keyboard-focusable. Autocomplete='current-password' on Login/Re-Auth; autocomplete='new-password' on Registration. Mobile: 44px minimum touch target for toggle icon.

## OTP Input Field
Specialised input for entering the one-time passcode on the OTP Verification Screen (SCR-002). Format and length TBD with stakeholders. May be rendered as a single input or segmented individual character boxes. Supports numeric or alphanumeric input per stakeholder decision.

- Usage: Use exclusively on SCR-002 (OTP Verification) and as the destination screen from SCR-008 (OTP Recovery Hub). Center-align the input. Display inline error for incorrect OTP directly below. Display expiry error state when countdown reaches zero.
- States: Default, Focus, Filled, Error / Incorrect OTP, Expired, Disabled
- Cross-platform notes: Web: inputmode='numeric' (or 'text' per stakeholder OTP format decision). autocomplete='one-time-code' for browser/OS autofill support. If segmented boxes: auto-advance focus on character entry. Mobile: triggers numeric keyboard. Minimum touch target 44px per character box.

## Primary Button
Main call-to-action button used for primary form submissions and key actions: 'Register' (SCR-001), 'Verify' / 'Submit OTP' (SCR-002), 'Continue to Login' (SCR-003), 'Sign in' (SCR-004), 'Send verification email' (SCR-008), 'Sign in to continue' (SCR-010).

- Usage: Use for the single most important action on each screen. One primary button per screen/form. Full-width within form containers on mobile. Fixed width or content-width on desktop. Never use for destructive actions — use Destructive Button instead.
- States: Default, Hover, Focus, Active / Pressed, Loading, Disabled
- Cross-platform notes: Web: border-radius 6px, padding 10px 20px, min-height 44px. Loading state shows inline spinner and disables interaction. Disabled state uses aria-disabled='true'. Mobile: full-width (100%) within form card. Minimum touch target 44px height.

## Secondary Button
Secondary action button used for non-destructive cancel or alternative actions: 'Keep my account' / 'Cancel' (SCR-006), 'Cancel' (SCR-010), 'Back to Login' (SCR-008, SCR-009).

- Usage: Use for secondary or cancel actions that do not submit data or trigger irreversible operations. Rendered as an outlined button. Pair with a Primary Button when both actions are present on the same screen.
- States: Default, Hover, Focus, Active / Pressed, Disabled
- Cross-platform notes: Web: border-radius 6px, padding 10px 20px, min-height 44px, border 1px solid. Mobile: full-width within form card. Stacked below Primary Button on mobile. Minimum touch target 44px.

## Destructive Button
Irreversible action button used exclusively for the 'Delete my account' confirmation action on SCR-006 (Account Deletion Confirmation Screen). Visually distinct from Primary Button to signal danger and irreversibility.

- Usage: Use ONLY for the final confirmed account deletion action on SCR-006. Must always be paired with a Secondary Button ('Keep my account' / 'Cancel'). Must be preceded by the irreversibility statement and itemised data-scope list. Never use for any other action.
- States: Default, Hover, Focus, Active / Pressed, Loading, Disabled
- Cross-platform notes: Web: border-radius 6px, padding 10px 20px, min-height 44px. If typed-confirmation mechanism is used, button remains disabled until confirmation text matches. Loading state disables button and shows spinner. Mobile: full-width, stacked above Secondary Button.

## Form Validation Message
Inline error or success message rendered directly below a form field. Used for field-level validation on Registration (SCR-001), OTP entry (SCR-002), and all other form screens. Includes an icon (error icon for errors, check icon for success) and descriptive text. Never relies on color alone.

- Usage: Render below the relevant input field immediately on blur (for format errors) or on form submission (for server-side errors). Always include an icon alongside the color and text. Error messages must be associated with the input via aria-describedby for screen reader compatibility.
- States: Error, Success, Warning, Info
- Cross-platform notes: Web: role='alert' or aria-live='polite' for dynamic error injection. Associate with input via aria-describedby. Font size 13px. Icon 14px, vertically aligned with first line of text. Mobile: same behavior, ensure text wraps cleanly within form width.

## Notification Banner
Full-width or card-width banner used for screen-level status messages that are not tied to a specific field. Used for: SMTP failure (SCR-001, SCR-002, SCR-008), anti-enumeration login error (SCR-004), session-expiry message (SCR-004, SCR-005, SCR-010), resend confirmation feedback (SCR-002), post-deletion confirmation (SCR-007), deletion rollback error (SCR-009).

- Usage: Use for screen-level or flow-level messages. Always include an icon and text — never color alone. Render at the top of the form card or screen content area. Dismiss button optional for informational banners; error and warning banners persist until resolved.
- States: Success, Error, Warning, Info
- Cross-platform notes: Web: border-left 4px solid border_color, border-radius 6px, padding 12px 16px. role='alert' for error/warning; role='status' for success/info. Icon 18px. Mobile: full-width within screen content area. Ensure sufficient padding for readability on small screens.

## Countdown Timer
Prominent real-time countdown display on the OTP Verification Screen (SCR-002). Shows remaining time in the 5-minute OTP validity window. Transitions to a warning state as time approaches zero. Resets when a new OTP is requested via the resend mechanism.

- Usage: Use exclusively on SCR-002. Display prominently below the instructional copy and above the OTP input field. Update in real time (every second). Transition to Warning Amber (#D97706) color and warning banner when timer reaches a low threshold (e.g., 60 seconds remaining). Show distinct expiry state when timer reaches zero.
- States: Active (>60s remaining), Warning (≤60s remaining), Expired (0:00)
- Cross-platform notes: Web: Use tabular/monospace numeral variant of Inter (font-variant-numeric: tabular-nums) to prevent layout shift during countdown. aria-live='polite' for timer updates; aria-live='assertive' for expiry state. Mobile: center-aligned, large enough to read at a glance (min 18px). Do not rely on color alone — include text label ('Time remaining', 'OTP expired').

## Confirmation Dialog / Deletion Confirmation Screen
Dedicated full-page confirmation screen (not a modal overlay) for the account deletion flow on SCR-006. Contains the irreversibility statement, itemised data-scope list, deliberate affirmative confirmation mechanism (typed confirmation input and/or Destructive Button), and a Cancel/Keep my account Secondary Button.

- Usage: Use as a full-page screen (not a modal) for the account deletion confirmation step to ensure the user fully reads and understands the consequences. The Destructive Button must be clearly labelled. The Cancel button must be equally prominent. Session-expiry-aware re-entry indicator shown as an Info Notification Banner when user returns after re-authentication.
- States: Default, Session Re-Entry (post re-auth), Typed Confirmation Incomplete, Typed Confirmation Complete
- Cross-platform notes: Web: Render as a full-page screen within the authenticated layout. Do not use a modal/dialog overlay — the gravity of the action requires full-page treatment. Itemised data list uses a bulleted or numbered list element. Mobile: single-column, scrollable if content exceeds viewport. Destructive Button and Cancel Button stacked vertically, full-width.

## Trust Signal
Small inline indicator communicating security and data-handling assurance at key decision points. Appears on Registration (SCR-001), OTP Verification (SCR-002), Login (SCR-004), Account Deletion Confirmation (SCR-006), and Post-Deletion Confirmation (SCR-007) screens.

- Usage: Render at the bottom of the form card or below the primary action button. Use a lock icon paired with brief text (e.g., 'Secured with HTTPS' or 'Your data is handled securely'). Keep text concise (caption size, 12px). Do not use as a primary UI element — it is supplementary.
- States: Default
- Cross-platform notes: Web: Inline flex, icon 14px, text 12px, gap 4px. Mobile: same, centered below form actions. Ensure icon has aria-hidden='true' and text is the accessible label.

## Link / Text Button
Inline text link or text-only button used for secondary navigation and recovery actions: 'Sign in' (SCR-001), 'Create an account' (SCR-004), 'Resend OTP' (SCR-002), 'Complete verification' / OTP Recovery Hub entry (SCR-004), 'Back to Login' (SCR-008, SCR-009), 'Cancel' text link.

- Usage: Use for navigation links and low-emphasis actions that do not require a button container. Underline on hover and focus. Use Primary Blue (#2563EB) for standard links. Use Error Red (#DC2626) only for destructive text links if applicable. Always keyboard-focusable.
- States: Default, Hover, Focus, Visited, Disabled
- Cross-platform notes: Web: text-decoration underline on hover and focus. cursor: pointer. Minimum click target 44px height via padding. Mobile: minimum touch target 44px. Rate-limited 'Resend OTP' link transitions to Disabled state during cooldown period with countdown label.

## Form Card / Screen Container
White card container that wraps form content on all authentication and onboarding screens (SCR-001 through SCR-010). Provides visual separation from the neutral page background, consistent padding, and a clean surface for form elements.

- Usage: Use as the primary content container for all form-based screens. Center horizontally on desktop. Full-width with horizontal padding on mobile. Max-width 480px on desktop for single-column forms. Max-width 560px for confirmation screens with itemised lists.
- States: Default
- Cross-platform notes: Web: border-radius 8px, padding 32px on desktop, 24px on mobile. border 1px solid #E5E7EB. Centered vertically and horizontally on desktop using flexbox. Mobile: margin 16px horizontal, no border-radius or subtle border-radius 8px. Scrollable if content exceeds viewport height.

## Dashboard Section
Authenticated content area on the Dashboard Screen (SCR-005). Contains the user greeting/identity indicator, main protected content area, account deletion entry point, and logout action. Structured with clear visual hierarchy.

- Usage: Use on SCR-005 only. The 'Delete Account' entry point must be visually distinct (use Destructive Button style or a clearly labelled danger-zone section) but not so prominent as to encourage accidental clicks. Logout action accessible at all times within the authenticated area.
- States: Authenticated, Session Expiry Warning
- Cross-platform notes: Web: Full-width layout with max-width 960px content area. Logout button in top-right of header area. Delete Account in a visually separated 'Danger Zone' section at the bottom of the dashboard content. Mobile: single-column, stacked sections. Logout accessible via header or menu.
