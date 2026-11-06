import { createContext, useContext } from 'react';

// Scaffold-only session state. Session issuance/validation is owned by the
// upstream API and will be wired during F-02 build-out.
// TODO(OQ-05): Session timeout duration is TBD; do not add an idle/expiry timer until resolved.

export interface SessionState {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
}

export const SessionContext = createContext<SessionState | undefined>(undefined);

export function useSession(): SessionState {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
