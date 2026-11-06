export interface CountdownTimerProps {
  secondsRemaining: number;
}

const WARNING_THRESHOLD_SECONDS = 60;

function format(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Countdown Timer stub (Active >60s, Warning <=60s, Expired 0:00). Ticking and
// reset-on-resend behaviour will be added during SCR-002 build-out.
export function CountdownTimer({ secondsRemaining }: CountdownTimerProps) {
  const expired = secondsRemaining <= 0;
  const warning = !expired && secondsRemaining <= WARNING_THRESHOLD_SECONDS;
  const modifier = expired ? 'expired' : warning ? 'warning' : 'active';

  return (
    <p
      className={`ums-timer ums-timer--${modifier}`}
      aria-live={expired ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {expired ? 'OTP expired' : `Time remaining ${format(secondsRemaining)}`}
    </p>
  );
}
