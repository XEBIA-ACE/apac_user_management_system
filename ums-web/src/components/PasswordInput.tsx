import { useId, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FormValidationMessage } from './FormValidationMessage';

export interface PasswordInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'type'
> {
  label: string;
  error?: string;
  autoComplete: 'current-password' | 'new-password';
}

// Password Input stub with show/hide toggle.
// TODO(OQ-04): Password complexity rules are TBD; real-time complexity feedback
// on SCR-001 must not be implemented until the rules are agreed.
export function PasswordInput({ label, error, ...rest }: PasswordInputProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const [visible, setVisible] = useState(false);

  return (
    <div className="ums-field">
      <label className="ums-label" htmlFor={id}>
        {label}
      </label>
      <div className="ums-password">
        <input
          id={id}
          className="ums-input"
          type={visible ? 'text' : 'password'}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        <button
          type="button"
          className="ums-button ums-button--secondary"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-controls={id}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
        </button>
      </div>
      {error && <FormValidationMessage id={errorId} variant="error" message={error} />}
    </div>
  );
}
