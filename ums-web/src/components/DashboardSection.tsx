import { useId, type ReactNode } from 'react';

export interface DashboardSectionProps {
  heading: string;
  children?: ReactNode;
  danger?: boolean;
}

// Dashboard Section stub (SCR-005 only). Use `danger` for the visually
// separated 'Danger Zone' that hosts the Delete Account entry point.
export function DashboardSection({ heading, children, danger = false }: DashboardSectionProps) {
  const headingId = useId();
  return (
    <section
      className={
        danger ? 'ums-dashboard-section ums-dashboard-section--danger' : 'ums-dashboard-section'
      }
      aria-labelledby={headingId}
    >
      <h2 id={headingId}>{heading}</h2>
      {children}
    </section>
  );
}
