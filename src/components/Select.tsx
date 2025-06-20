import { Select as BaseSelect } from '@base-ui-components/react/select';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value?: string;
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
}

const Select = ({ value, onValueChange, placeholder, options, className = '' }: SelectProps) => {
  const selectValue = value ? [value] : undefined;
  
  return (
    <BaseSelect.Root value={selectValue} onValueChange={onValueChange}>
      <BaseSelect.Trigger className={`w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 flex items-center justify-between hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${className}`}>
        <BaseSelect.Value placeholder={placeholder} />
        <BaseSelect.Icon>
          <ChevronDown size={16} className="text-gray-400" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner>
          <BaseSelect.Popup className="bg-gray-700 border border-gray-600 rounded-lg shadow-lg p-1 min-w-[200px] z-50">
            {options.map((option) => (
              <BaseSelect.Item 
                key={option.value} 
                value={option.value} 
                className="px-3 py-2 text-sm hover:bg-gray-600 rounded cursor-pointer flex items-center justify-between"
              >
                <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                <BaseSelect.ItemIndicator>✓</BaseSelect.ItemIndicator>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
};

export { Select, type SelectOption, type SelectProps };