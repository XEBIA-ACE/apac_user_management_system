import { Lock } from 'lucide-react';

export interface TrustSignalProps {
  text?: string;
}

// Trust Signal stub.
export function TrustSignal({ text = 'Your data is handled securely' }: TrustSignalProps) {
  return (
    <p className="ums-trust">
      <Lock aria-hidden="true" size={14} />
      <span>{text}</span>
    </p>
  );
}
