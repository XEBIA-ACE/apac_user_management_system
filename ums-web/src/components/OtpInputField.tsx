import { useId, type InputHTMLAttributes } from 'react';
import { FormValidationMessage } from './FormValidationMessage';

export interface OtpInputFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'type'
> {
  label: string;
  error?: string;
}

// OTP Input Field stub (Default, Focus, Filled, Error / Incorrect OTP, Expired, Disabled).
// TODO(OTP format/length TBD): inputMode, maxLength and single vs. segmented
// rendering depend on the stakeholder OTP format decision.
// TODO(OQ-02): Maximum incorrect OTP submissions before lockout is TBD.
export function OtpInputField({ label, error, ...rest }: OtpInputFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="ums-field">
      <label className="ums-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="ums-input ums-input--otp"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && <FormValidationMessage id={errorId} variant="error" message={error} />}
    </div>
  );
}
