import { useId, type InputHTMLAttributes } from 'react';
import { FormValidationMessage } from './FormValidationMessage';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  helperText?: string;
  error?: string;
}

// Text Input stub (Default, Focus, Filled, Error, Disabled).
export function TextInput({ label, helperText, error, type = 'text', ...rest }: TextInputProps) {
  const id = useId();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const describedBy = [helperText ? helperId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="ums-field">
      <label className="ums-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="ums-input"
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        {...rest}
      />
      {helperText && <span id={helperId}>{helperText}</span>}
      {error && <FormValidationMessage id={errorId} variant="error" message={error} />}
    </div>
  );
}
