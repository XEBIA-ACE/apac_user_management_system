import { useMemo, useState, type ReactNode } from 'react';
import { SessionContext, type SessionState } from './session';

export function SessionProvider({
  children,
  initialAuthenticated = false,
}: {
  children: ReactNode;
  initialAuthenticated?: boolean;
}) {
  const [isAuthenticated, setAuthenticated] = useState(initialAuthenticated);
  const value = useMemo<SessionState>(
    () => ({
      isAuthenticated,
      signIn: () => setAuthenticated(true),
      signOut: () => setAuthenticated(false),
    }),
    [isAuthenticated],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
