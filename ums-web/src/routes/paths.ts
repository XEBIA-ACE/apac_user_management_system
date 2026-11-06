export const ROUTES = {
  root: '/',
  register: '/register', // SCR-001
  verifyOtp: '/verify-otp', // SCR-002
  verifyOtpSuccess: '/verify-otp/success', // SCR-003
  login: '/login', // SCR-004
  dashboard: '/dashboard', // SCR-005
  deleteAccount: '/dashboard/delete', // SCR-006
  accountDeleted: '/account-deleted', // SCR-007
  otpRecovery: '/verify-otp/recover', // SCR-008
  deleteAccountError: '/dashboard/delete/error', // SCR-009
  sessionReauth: '/session/reauth', // SCR-010
} as const;
