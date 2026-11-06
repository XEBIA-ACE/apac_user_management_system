import { useId, type ReactNode } from 'react';

export interface FormCardProps {
  heading: string;
  children?: ReactNode;
  wide?: boolean;
}

// Form Card / Screen Container stub. Max-width 480px for forms, 560px (wide)
// for confirmation screens with itemised lists.
export function FormCard({ heading, children, wide = false }: FormCardProps) {
  const headingId = useId();
  return (
    <div className="ums-card-container">
      <section
        className={wide ? 'ums-card ums-card--wide' : 'ums-card'}
        aria-labelledby={headingId}
      >
        <h1 id={headingId}>{heading}</h1>
        {children}
      </section>
    </div>
  );
}
