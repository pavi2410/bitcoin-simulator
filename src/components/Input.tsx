import { type InputHTMLAttributes } from 'react';
import { Field } from '@base-ui-components/react/field';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const Input = ({ label, value, onChange, type = 'text', className = '', ...props }: InputProps) => {
  return (
    <Field.Root>
      <Field.Label className="block text-sm font-medium mb-2">
        {label}
      </Field.Label>
      <Field.Control
        render={(fieldProps) => (
          <input
            {...fieldProps}
            {...props}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${className}`}
          />
        )}
      />
    </Field.Root>
  );
};

export { Input, type InputProps };