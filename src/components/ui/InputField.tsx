import React from 'react';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  type?: string;
  large?: boolean;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder = '',
  value,
  type = 'text',
  large = false,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
  
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {large ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          spellCheck={false}
          className={`${baseClasses} min-h-[120px] resize-vertical`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          spellCheck={false}
          className={baseClasses}
        />
      )}
    </div>
  );
};

export default InputField;